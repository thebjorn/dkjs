
============
Data sources
============

.. raw:: html

    <style>
    .div {
        padding: 2px 4px;
        border: 1px dashed #666;
        margin: 1ex;
    }
    .section .section { margin-left: 2em; }
    </style>


A DataSource is an abstract representation of a tabular dataset, that
provides a uniform interface to multiple sources of data (models, orm,
etc.).

The data that is returned from the url/json-source/view, should be in
the following format (tt3.employee.history.dayview.py[queryset2gdata]
is a function that converts a Django QuerySet to this format)::

        {
            cols: [
                {
                    label: "Name",
                    field: "name",
                    help_text: "First name",
                },
                ...
            ],
            rows: [
                { k: 123, c: [{v: 'Bjorn', f:..}, {v: 42, f:..}] },
                { k: 132, c: [{v: 'Jake', f:..}, {v: 33, f:..}] }
            ]
        }

        gdata := { rows: [], cols: [] }
        rows := { k: PRIMARY-KEY, c: [] }
        c := VALUE list
        VALUE := { v: COLUMN-VALUE, f: HTML-INPUT-WIDGET }
        cols := {
            label: "text label",
            field: "fieldname",
            help_text: "help text",
        }




Data display and marshalling
============================

.. graphviz::

    digraph foo {
        node [shape=box];
        rankdir = LR
        splines = curved
        server -> wire_json [style=dashed]
        // wire_json -> server [style=dashed]

        wire_json -> {parse; encode;}
        {parse; encode;} -> internal_data;
        internal_data -> {widget; toString; encode;}
        toString -> display;
        encode -> wire_json;

        {rank=same; parse; encode; }
        parse [shape=oval,label="dk.json.parse()",style=filled,color=blue,fontcolor=white]
        encode [shape=oval,label="toJSON()",style=filled,color=blue,fontcolor=white]
        toString [shape=oval,label="dk.[data].toString()",style=filled,color=blue,fontcolor=white]

        wire_json [label="JSON\non the wire"]
        internal_data [label="dk.[data] objects"]
    }






DataSourceBase
--------------

.. graphviz::

    digraph foo {
        node [shape=box];
        base -> array;
        base -> json;

        base [label="dk.DataSourceBase",color=green,fontcolor=white,style=filled];
        array [label="dk.ArrayDataSource"];
        json [label="dk.JsonDataSource"];
    }


.. js:class:: dk.DataSourceBase

    The ``dk.DataSourceBase`` (abstract) base class defines the interface
    that all data source classes must follow:

.. js:attribute:: dk.DataSourceBase.fields

    This is a list of `field` objects::

        {
            fieldname:  string,  // the name of the field
            title: string,       // the help-text of the field
            label: string        // the displayed label of the field
        }

.. js:attribute:: dk.DataSourceBase.data

    A reference to the underlying data.

.. js:attribute:: dk.DataSourceBase.curpage

    A reference to the data of the current page.

.. js:attribute:: dk.DataSourceBase.cache

    ???

.. js:function:: dk.DataSourceBase.fetch_page(params)

    Fetch a page of data. The params specify which page and how many
    records per page. This is the regular entry-point for a DataSource.

    .. :param params:

    ..     params := {
    ..         q: list of search terms
    ..         s: sort specifier
    ..         p: page number to fetch (1-based)
    ..         z: records per page
    ..         ft:  filter values
    ..         orphans: number of orphans to protect
    ..     }


.. js:function:: dk.DataSourceBase.records(fn)

    For each record in the currently "displayed" page, call ``fn``.

    :param fn: function(rownum, primary_key, columndata)



DataSourceBase
--------------

.. graphviz::

    digraph foo {
        node [shape=box];
        base -> array;
        base -> json;

        base [label="dk.DataSourceBase"];
        array [label="dk.ArrayDataSource",color=green,fontcolor=white,style=filled];
        json [label="dk.JsonDataSource"];
    }


.. js:class:: dk.ArrayDataSource

    Define a datasource as an array of simple property objects::

        var ds = dk.ArrayDataSource.create({
            data: [
                {project: 'Generelt NT', work: '1:03:57'},
                {project: 'Generelt NT', work: '1:03:57'},
                {project: 'AFR-support', work: '1:06:43'}
            ]
        });


JsonDataSource
--------------

.. graphviz::

    digraph foo {
        node [shape=box];
        base -> array;
        base -> json;

        base [label="dk.DataSourceBase"];
        array [label="dk.ArrayDataSource"];
        json [label="dk.JsonDataSource",color=green,fontcolor=white,style=filled];
    }

.. js:class:: dk.JsonDataSource

    A datasource that fetches data through a json interface.



