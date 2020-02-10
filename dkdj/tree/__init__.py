# -*- coding: utf-8 -*-
"""
Tree structured data
======================

The TeeDatasource and PathTreeDataSource help serialize hierarchical data,
so that it can be represented as a tree structure in js/html.

The data structures are represented as a flat structure (i.e. without nesting)
using the ``.cache`` field, which is a dict from node.key -> node, where 
node.key is unique for the entire tree/forrest.
(nodes are represented using :class:`TreeNode`).

.. note:: integer keys should be avoided since they cause problems in js.
          (e.g. prepend a character, ``"p120"`` instead of just ``120``).

You should add nodes inside a with-statement so :class:`TreeDatasource`
gets a chance to connect the hierarchy, i.e.::

    page = Page(request)
    projects = Project.objects.all()
    
    with TreeDatasource() as ds:
        for p in projects:
            ds += TreeNode(
                key=f'p{id}',
                value=p.id,
                label=p.name,
                parent=p.parent     # see below
            )
        page.project_tree = ds

instead of specifying ``.parent``, you can alternatively specify ``.children``
or ``.path``.

If specifying children, you need to specify their `key`, and promise that
they are present in the datasource::

    with TreeDatasource() as ds:
        for p in projects:
            ds += TreeNode(
                key=f'p{id}',
                value=p.id,
                label=p.name,
                children=[f'p{child.id}' for child in p.children.all()]
            )

The datasource will raise an exception if there is a child-id that isn't
present in ds.cache at the end of the with-statement.

A :class:`PathTreeDataSource` is a Tree data source where only the leaf-nodes
need to be specified.
"""
from .treeds import TreeDatasource
from .pathtreeds import PathTreeDataSource
from .treenode import TreeNode


