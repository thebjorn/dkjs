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
from __future__ import print_function
from six import itervalues

try:  # pragma: nocover
    from cStringIO import StringIO
except ImportError:  # pragma: nocover
    from io import StringIO

from . import jason


class TreeDatasource(object):
    """Tree data source for src/widgets/tree.
    
       Usage::
       
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

    """
    cache = {}  #: all tree nodes in a flat structure 
    roots = []  #: root-node keys (discovered automatically)
    depth = 0  #: the maximum depth of the hierarchy (calculated)
    height = 0  #: the maximum number of nodes at any given depth (calculated)

    def __init__(self):
        self.cache = {}  # overwrite mutable globals
        self.roots = []
        self.keys = {}

    def __iter__(self):
        return iter(self.cache.values)

    def __contains__(self, key):
        return key in self.cache

    def __json__(self):
        return dict(cache=self.cache, roots=self.roots)

    def add_item(self, item):
        """Add a single item to the datasource. The item should be of 
           type :class:`TreeNode`.
        """
        item.infer_missing_data(self)
        
        if item.key not in self.cache:
            self.cache[item.key] = item

    # def add_items(self, items):
    #     """Add one or more items to the datasource. The item(s) should
    #        be of :class:`TreeNode`.
    #     """
    #     if not items:
    #         return self
    #     if isinstance(items, list):
    #         for item in items:
    #             self.add_item(item)
    #     else:
    #         self.add_item(items)
    #     return self

    __iadd__ = add_item

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connect_generations()
        
    def connect_generations(self):
        """Internal method to connect parent/child relationships.
        """
        # at this point self.cache contains all nodes in the tree

        # if we have children, add node as parent to each child
        for key, node in self.cache.items():
            for child in node.children:
                try:
                    child_obj = self.cache[child]
                except KeyError:
                    raise ValueError("""
                        Node {}:{} is referencing a child with key={} which 
                        has not been added to the datasource.
                    """.format(key, repr(node), child))
                if not child_obj.parent:
                    child_obj.parent = key

        # have_parent, but maybe not path => traverse parents to root
        for node in self.cache.values():    # XXX: should this swap places with the next for-loop?
            node.find_path(self.cache)  # also sets node.root
            
        # if not children, then: add each node as a child to its parent
        for key, node in self.cache.items():
            if node.parent:
                parent = self.cache[node.parent]
                if node.key not in parent.children:
                    parent.children.append(key)
                    
        # node.root is set during node.find_path(..) above.
        self.roots = list({node.root for node in self.cache.values()})
        print(repr(self))
        self.validate()
        
    # def unique(self, obj):  # XXX: confusing, don't use
    #     """[DEPRECATED] Return a string value for obj, that is unique over all
    #        nodes in the tree.
    #     """
    #     return obj.tree_key()   # str(id(obj))  # pragma: nocover
    # 
    # def as_treenode(self, obj):     # XXX: confusing, don't use
    #     """[DEPRECATED] Convert obj to a tree node (TreeNodeResource).
    #     """
    #     return obj.tree_node()      # XXX: even more confusing...

    def __repr__(self):
        out = StringIO()

        def prtree(key, depth):
            node = self.cache[key]
            fmt = "{indent}{label}\n"
            lbl = node.label
            # if isinstance(lbl, unicode):
            #     lbl = lbl.encode('ascii', 'ignore')  # pragma: nocover
            out.write(fmt.format(indent='    ' * depth,
                                 label=lbl))
            for c in node.children:
                prtree(c.encode('u8'), depth + 1)

        for r in self.roots:
            prtree(r, 0)
        return out.getvalue()

    def validate(self):    # pragma: nocover
        """Validates the structure of the tree data source. This is 
           automatically called when the datasource leaves the with-statement.
        """
        for k, node in self.cache.items():
            is_root = (node.root == node.key or len(node.path) == 1 or node.parent is None)

            if is_root:
                if len(node.path) != 1:
                    raise ValueError(jason.dump2(node))
                if node.root != node.key:
                    
                    raise ValueError("""
                        NODE is-root because one of
                        
                         ==>i.    node.root==node.key ({}=={} -> {})
                            ii.   len(node.path) == 1 (len({})=={})
                            iii.  node.parent is None ({})
                            
                        check the node data: {}
                    """.format(
                        repr(node.root), repr(node.key), node.root==node.key,
                        node.path, len(node.path),
                        node.parent,
                        jason.dumps(node)
                    ))
                if node.key != k:
                    raise ValueError(jason.dump2(node))
                if node.parent is not None:
                    raise ValueError(jason.dump2(node))

            if len(node.children) != len(set(node.children)):
                raise ValueError(jason.dump2(node))

            if node.parent:
                if node.key not in self.cache[node.parent].children:
                    raise ValueError(jason.dumps(node))
        return True


class PathTreeDataSource(TreeDatasource):
    """The PathTreeDataSource resource is a hierarchical n-ary forrest data
       structure, where the nodes on the path to the leaf-nodes do not have 
       to be specified.

       For example, the tree::

           .
            `-- a
                L__ b
                    |-- c
                    L__ d

       can be specified using only the ``c`` and ``d`` nodes.
    """

    # noinspection PyMethodFirstArgAssignment
    def __init__(self, nodes=()):
        super(PathTreeDataSource, self).__init__()
        self += nodes
        
    @classmethod
    def get_path(cls, pth, delim='/'):
        """Convert a path list (``['a', 'b', 'c']``) to a list of keys, ie.::
           
               PathTreeDataSource.get_path('a/b/c'.split('/'), delim='/') == [
                   'a',                    
                   'a/b',                    
                   'a/b/c',                    
               ]
        """
        lst = pth.split(delim)
        return [delim.join(lst[:i]) for i in range(1, len(lst))]

    def prefix_list(self, s, delim='/'):
        """[DEPRECATED]
        """
        lst = s.split(delim)
        return [delim.join(lst[:i]) for i in range(1, len(lst))]

    def _add_missing_path_nodes(self):
        """Add nodes for intermediate path nodes that have not been explicitly
           added.
        """
        for node in list(self.cache.values()):
            parents = node.path[:-1]
            for i, p in enumerate(parents, 1):
                if p not in self:
                    print(node.key, node.path, "INTERMEDIATE-NODE:")
                    self.cache[p] = TreeNode(
                        label=p,
                        path=parents[:i]    
                    )
    
    def connect_generations(self):
        self._add_missing_path_nodes()
        super(PathTreeDataSource, self).connect_generations()


class TreeNode(object):
    """A data structure to store data for a single node in the tree.
    
       Args:
           key (str):       a unique id for the entire tree
           
           value (str):     the value to return if this tree node 
                            is selected
           label (str):     the label to display for this node
                            (if not provided the ``value`` will be used)
           parent (str):    the key of the parent node
           
           children (list): a list of the keys to this node's 
                            direct children
           path (list):     a list of the keys from the root to this node
                            path[-1] must be equal to key
    
       You must include at least one of parent, children, or path.
    """
    def __init__(self, key=None, value=None, label=None, 
                 parent=None, children=None, path=None):
        
        assert key or path, "must have either key or path"
        self.key = key
        self.value = value
        self.label = label or str(value)
        self.parent = parent
        self.children = children or []
        self.path = path
        self.root = None
        
    def infer_missing_data(self, ds):
        pass
        
        # if path:
        #     # we're the last item in path
        #     if self.key is None:
        #         self.key = u':/:'.join(path)
        #     # our parent is next to last
        #     self.parent = self.path[-2] if len(self.path) >= 2 else None
        #     # .. and the root is the first element
        #     self.root = self.path[0]

    # def find_path(self, cache):
    #     if not self.path:
    #         if not self.parent:
    #             self.path = [self.key]
    #         else:
    #             parentpath = cache[self.parent].find_path(cache)
    #             self.path = parentpath + [self.key]
    #         self.root = self.path[0]
    #     return self.path

    def __json__(self):
        return self.__dict__
            
    def __repr__(self):  # pragma: nocover
        return "TreeNode(name=%s, key=%s, parent=%s, path=%s, children=%s)" % (
            self.label, self.key, self.parent, self.path, self.children
        ) 
