.. -*- coding: utf-8 -*-

---------
Resultset
---------

``dk.table.ResultSet`` (searching, paging, filtering, ..)
========================================================================
ResultSets are created by constructing a ``dk.DataTable`` inside ``dk.table.ResultSet``'s
``construct_table`` method.

.. image:: /images/resultset-sample.png

.. note:: Resultsets require that the datasource is wrapped in a ``dk.data.DataSet`` object.
          Datasources deal with records, while DataSets deal with pages. You can specify
          pagesize and orphans on a DataSet (if you want to override the defaults).


The general structure is:

.. code-block:: javascript

    dk.table.ResultSet.create_inside(this.work, {
        construct_table: function (location) {

            return dk.DataTable.create_on(location, {
                data: dk.data.DataSet.create({
                    datasource: ...,
                    pagesize: 5,
                    orphans: 4
                }),
                columns: ...
            });
        }
    });

The resultset above was created from this code:


.. code-block:: javascript
    :linenos:

    dk.table.ResultSet.create_inside(this.work, {
        construct_table: function (location, downloadwidget) {
            return dk.DataTable.create_on(location, {
                classes: ['table table-bordered table-hover table-condensed'],
                download: downloadwidget,

                data: dk.data.DataSet.create({
                    datasource: dk.data.ArraySource.create([
                        {project: 'first', work: '1:03:57'},
                        {project: 'aTiktok', work: '2:44:57'},
                        {project: 'bGenerelt NT', work: '1:03:57'},
                        {project: 'cTiktok', work: '2:44:57'},
                        {project: 'dGenerelt NT', work: '1:03:57'},
                        {project: 'eTiktok', work: '2:44:57'},
                        {project: 'fGenerelt NT', work: '1:03:57'},
                        {project: 'gTiktok', work: '2:44:57'},
                        {project: 'hGenerelt NT', work: '1:03:57'},
                        {project: 'iTiktok', work: '2:44:57'},
                        {project: 'jGenerelt NT', work: '1:03:57'},
                        {project: 'kTiktok', work: '2:44:57'},
                        {project: 'last', work: '1:06:43'}
                    ]),
                    pagesize: 5,
                    orphans: 4
                }),

                columns: {
                    project: {label: 'Prosjekt'},
                    work: {label: 'Arbeid'}
                }
            });
        }
    });


Connecting Django query sets to the ResultSet
--------------------------------------------------
The Django/server-side code needs to define a class that can serialize tabular data to dkdj.
The class based views sub-classes in ``dkdj.views`` will help with this.  For simple tabular
data it might be enought to use one of the base classes, if not subclassing from ``dkdj.views.ModelGrid``
is usually a safe choice.

The example below is actually using a dkorm query set, but as you can see, the syntax is identical::

    class VoxParticipantList(dkdj.views.ModelGrid):
        model = VoxParticipant
        columns = """participant_name first_name last_name primary_email
                  """.split()

        def get_queryset(self, request):
            return VoxParticipant.objects.all()

The only absolutely necessary parts is the ``model``, the ``columns``, and the ``get_queryset()`` method
that returns the initial query set.

The only thing that needs to change on the client side is that the data source is now an ``dk.data.AjaxDataSource``:

.. code-block:: javascript
    :linenos:
    :emphasize-lines: 9-11

    dk.table.ResultSet.create_on('#participant-list', {
        construct_table: function (location, downloadwidget) {
            return dk.DataTable.create_on(location, {
                classes: ['table table-bordered table-hover table-condensed'],
                download: downloadwidget,

                data: dk.data.Data.create({
                    pagesize: 15,
                    datasource: dk.data.AjaxDataSource.create({
                        url: '{{ username }}/'
                    })
                }),
                columns: {
                    participant_name: {
                        label: 'Brukernavn',
                        format: function (v) {
                            return $('<a/>', {
                                href: `../participant/${v}/`
                            }).text(v);
                        }
                    },
                    first_name: {label: 'Fornavn'},
                    last_name: {label: 'Etternavn'},
                    primary_email: {label: 'EPost'}
                }
            });
        }
    });

which can be shortened to just the URL:

.. code-block:: javascript
    :linenos:
    :emphasize-lines: 9

    dk.table.ResultSet.create_on('#participant-list', {
        construct_table: function (location, downloadwidget) {
            return dk.DataTable.create_on(location, {
                classes: ['table table-bordered table-hover table-condensed'],
                download: downloadwidget,

                data: dk.data.Data.create({
                    pagesize: 15,
                    datasource: '{{ username }}/'
                }),
                columns: {
                    participant_name: {
                        label: 'Brukernavn',
                        format: function (v) {
                            return $('<a/>', {
                                href: `../participant/${v}/`
                            }).text(v);
                        }
                    },
                    first_name: {label: 'Fornavn'},
                    last_name: {label: 'Etternavn'},
                    primary_email: {label: 'EPost'}
                }
            });
        }
    });


Implementing search
--------------------------------------------------
A sensible way to implement search is to use the ``dk.search.search()`` function, which implements
a search similar to Django's admin search.

.. note::
   *TODO:* make dk.search.search() the default now that it has been extracted from datakortet!

defining a search function

.. code-block:: javascript
    :linenos:
    :emphasize-lines: 7-8

    class VoxParticipantList(dkdj.views.ModelGrid):
        model = VoxParticipant
        columns = """participant_name first_name last_name primary_email
                  """.split()
        default_sort = '-participant_name'

        def do_search(self, qs, terms):
            return search.search(self.model, terms, qs, ['participant_name'])

        def get_queryset(self, request):
            return VoxParticipant.objects.all()

You can override ``do_search()`` for any esoteric searching needs you may have, eg. implementing a search
that understood::

    Ryan -Gosling

to mean "find all 'Ryans', except those that also contain 'Gosling'".  All you would need to do is add
an exclude:

.. code-block:: python
    :linenos:
    :emphasize-lines: 4,9-10

        def do_search(self, qs, terms):
            termlist = terms.split()
            pos_terms = [t for t in termlist if not t.startswith('-')]
            neg_terms = [t for t in termlist if     t.startswith('-')]
            qs = search.search(self.model,
                               " ".join(pos_terms),
                               qs,
                               ['first_name', 'last_name'])
            for t in neg_terms:
                qs = qs.exclude(last_name=t[1:])  # remove the minus
            return qs


Defining columns
--------------------------------------------------
Often you'll need to transmit data that isn't a direct field on the base model of your grid, and you'll
need to override the ``get_columns(..)`` method:

.. code-block:: python
    :linenos:
    :emphasize-lines: 3, 8, 10

    class ProgressDataSource(dkdj.views.ModelGrid):
        model = Progress
        columns = "start end status".split()
        default_sort = '-start'
        ...

        def get_columns(self, request, qs, object_list):
            columns = super(ProgressDataSource, self).get_columns(request, qs, object_list)
            ...
            return columns

it is convenient to still list simple fields as before (line 3), in line 8 we convert the simple fields
to a list of columns which we can augment (line 9).  Don't forget to return the ``columns``!

.. code-block:: python
    :linenos:
    :emphasize-lines: 13-26

    class ProgressDataSource(dkdj.views.ModelGrid):
        model = Progress
        columns = "start end status".split()
        default_sort = '-start'

        def get_queryset(self, request, tl):  # pylint:disable=W0221
            dkhttp.debug_info(request)
            return Progress.objects.select_related()

        def get_columns(self, request, qs, object_list):
            columns = super(ProgressDataSource, self).get_columns(request, qs, object_list)

            @columns.append
            class photo(Column):
                sortable = False
                def value(self, item):
                    photo = item.candidate.bfp_registration.photo
                    if not photo:
                        return ""
                    return "<img style='max-width: 60px;' src='%s'>" % photo.get_size(width=100).url()

            @columns.append
            class testleader(Column):
                sort_field = 'testleader__username'
                def value(self, item):
                    return item.testleader.username

            return columns

.. warning:: Don't return raw foreign key fields unless you plan to edit them, and probably not even
             then (editing fkeys inline is usually not a good user experience). Instead, define
             a column as in the example above that has a ``value(..)`` method that returns a simple
             type.

Handling sorting
--------------------------------------------------
Sorting is handled automatically by passing the column names to ``qs.order_by(..)``.
As you can see from the example above, you can also declare columns to be unsortable (line 15), and
define a field to sort based on something other than what is displayed (line 24).


Creating filters
--------------------------------------------------
(client-side) Filters are added to the ``dk.table.ResultSet`` by implementing the ``construct_filter(..)``
method:

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 3

    dk.table.ResultSet.create_on(id, {

        construct_filter: function (location, dataset) { ... },

        construct_table: function (location, downloadwidget) {
            return dk.DataTable.create_on(location, { ... });
        }
    });

Simple value filters are simple

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 9, 11-14

    return dk.table.ResultSet.create_on(id, {

        construct_filter: function (location, dataset) {
            return dk.filter.DataFilter.create_on(filterbox, {
                dataset: self.dataset,
                filters: {
                    status: {
                        label: 'Status',
                        select_multiple: true,
                        values: {
                            'logged-in': 'Innlogget',
                            'sent-to-test': 'Sendt til QM',
                            'finished-pass': 'Bestått',
                            'finished-fail': 'Ikke bestått',
                        }
                    }
                }
            });

        },

        construct_table: function (location, downloadwidget) {
            return dk.DataTable.create_on(location, { ... });
        }
    });

(line 9) specifying ``select_multiple`` makes the filter use check-boxen instead of radio-buttons.

The values (starting at line 11) define the 'key' that will be sent to Django and the 'value' that
is displayed in the user interface.

You will need to do some actual filtering on the Django side by overriding the ``do_filter(..)``
method:

.. code-block:: python
   :linenos:
   :emphasize-lines: 6-9

    class ProgressDataSource(dkdj.views.ModelGrid):
        model = Progress
        columns = "start end status".split()
        default_sort = '-start'

        def do_filter(self, qs, terms):
            if terms.get('status'):  # check if the status filter was included
                qs = qs.filter(status__in=terms['status'])
            return qs

``terms`` is a dict from filter-names to the values for that filter, e.g.::

    {'status': ['logged-in', 'sent-to-test']}


Free-form filters
--------------------------------------------------
Filters can be completely free-form, all that is required is that update the ``.value``
property on the filter. The example below creates a input where the user
can enter a year-month string.  A jQuery ``on('change', ..)`` event handler is used to update the
``value`` property whenever the user changes the text.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 5,13

    filters: {
        month: {
            label: 'Måned <small>åååå-mm</small>',

            construct_filter: function (location, filter) {
                var inputgrp = $('<div/>').addClass('input-group');
                var mnth = $('<input/>', {type: 'month', placeholder: 'åååå-mm'}).addClass('form-control');
                var nxt = $('<button>&rsaquo;</button>').addClass('input-group-addon');
                inputgrp.append(mnth).append(nxt);
                this.widget = location.append(inputgrp);

                $(this.widget).find('input[type=month]').on('change', function () {
                    filter.value = $(this).val();
                    dk.trigger(filter, 'change', filter);
                });
            }
        },

the corresponding Python code to handle this filter would look something like:

.. code-block:: python
   :linenos:
   :emphasize-lines: 2

    def do_filter(self, qs, terms):
        if terms.get('month'):
            yr, mnth = terms['month'].split('-')
            month = ttcal.Month(int(yr, 10), int(mnth, 10))
            qs = qs.filter(start__range=(month.first, month.last))
        return qs

where the `terms.get('month')` refers to the filter name `month` created in line 2 of the previous listing.

Dynamic filters
--------------------------------------------------
If the filter is expensive to display, or if you don't know what the filter values will be
ahead of time, then the filter can call back to the datasource to fetch values. On the client
side this is very simple:

.. code-block:: javascript

    filters: {
        month: {
            ...
        },
        status: {
            ...
        },
        testleader: {
            label: 'Testleder',
            select_multiple: true
        }
    }

dkdj will call back to the ``get_testleader_filter_values(..)`` method to fetch values for the
testleader filter. The method it will call is named ``"get_" + filter-name + "_filter_values"``

.. code-block:: python
   :linenos:
   :emphasize-lines: 12, 18-19

    class ProgressDataSource(dkdj.views.ModelGrid):
        model = Progress
        columns = "start end status".split()
        default_sort = '-start'

        def get_testleader_filter_values(self, request, *args, **kwargs):
            """Returns a mapping representing the BFPTestLeaders that belong to the
               same testcenter as the current testleader.
            """
            tlname = kwargs['tl']  # 'tl' is a url parameter
            testleader = BFPTestLeader.objects.get(user__username=tlname)
            return [(tl.id, tl.user.username)
                    for tl in BFPTestLeader.objects.filter(
                        tctr=testleader.tctr
                    ).order_by('user__username')]

        def do_filter(self, qs, terms):
            if terms.get('testleader'):
                qs = qs.filter(testleader__bfp_testleader__id__in=terms['testleader'])
            if terms.get('month'):
                yr, mnth = terms['month'].split('-')
                month = ttcal.Month(int(yr, 10), int(mnth, 10))
                qs = qs.filter(start__range=(month.first, month.last))
            if terms.get('status'):
                qs = qs.filter(status__in=terms['status'])
            return qs

.. hint::  Returning a list of tuples, instead of a dictionary, will ensure that
           your filter values are presented in the right order (line 12).

Line 18-19 shows how to handle the filtering of these values.























