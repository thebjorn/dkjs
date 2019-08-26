.. -*- coding: utf-8 -*-

--------------------------
Frequently Asked Questions
--------------------------

Not neccessarily anything frequent about these questions, they're just 
questions that have been asked and answered.  Most/many of these will 
eventually migrate into their respective component's documentation.


[ModelGrid] How do I add a column?
    To add columns you simply add a list of field names in your `ModelGrid` 
    columns attribute if the default options work for you.

    You can also override `get_columns()` if you need to override e.g. the
    column `label`, the `datatype` the values are interpreted as, the `widget` 
    used to edit the field, the `data` (e.g. fkey values) the widget uses, or 
    the `url` used ot fetch widget data (e.g. fkey values).

    .. Note:: You can combine the two approaches if you want to keep the columns
              you've listed in the `ModelGrid` `columns` attribute, by invoking
              `super()` and appending any new columns. Since you're already
              overriding it might be easier to just specify all the columns in
              the overriden `get_columns` method.

    .. code-block:: python

        class ProgressGrid(dkjs.views.ModelGrid):
            model = Progress

            def get_columns(self, request, qs, object_list):
                column = grid.Model(self.model).column  # model-column fetcher

                return [
                    column.testleader,
                    column.candidate(label='Participant'),  # overriding label
                ]

[ModelGrid] How do I add a computed column?
    Computed columns are computed on the Python side. This is a bit of an
    oversight, but also has the advantage that sorting can be possible 
    even on computed columns.

    Given a simple model with a computed property

    .. code-block:: python

        class Person(models.Model):
            fname = models.CharField()
            lname = models.CharField()
            persnr = models.CharField()

            @propery
            def full_name(self):
                    return self.fname + ' ' + self.lname

    columns can be added to the `ModelGrid` in two ways

    .. code-block:: python

        class PersonGrid(dkjs.views.ModelGrid):
            model = Person

            def get_columns(self, request, qs, object_list):
                    column = grid.Model(self.model).column  # model-column fetcher

            from dkjs.grid import Column

            class full_name(Column):
                # looks up item.full_name
                pass

            class gender(Column):
                def value(self, item):
                    # calculate a value
                    return 'F' if int(item.persnr[7]) % 2 == 0 else 'M'

            return [
                    column.persnr,
                    full_name,
                    gender
            ]

[ModelGrid] How to prevent a fkey field from loading the entire table? (untested)
    It is the fkey widget used to edit the field that causes the fetching of 
    the entire related table (just like in Django forms).

    `dkjs` should probably look to see if the field is declared as 
    `raw_id_admin` in `admin.py`, however, until recently it has been difficult
    to get to the admin interface for a model.
    
    You can override the `widget` parameter of the column (see above) to use
    a `TextWidget`, but it is probably best to create a `__json__` method on
    the containing model

    .. code-block:: python

        class Progress(models.Model):
            testleader = models.ForeignKey(User, related_name="+")
            candidate = models.ForeignKey(User)
            ...

            def __json__(self):
                return dict(
                testleader=self.testleader.username,
                candidate=self.candidate.get_full_name(),
                ...
            )

    
