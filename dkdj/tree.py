# -*- coding: utf-8 -*-
from six import itervalues

try:  # pragma: nocover
    from cStringIO import StringIO
except ImportError:  # pragma: nocover
    from io import StringIO

from . import jason


class TreeNode(object):

    def __init__(self, key, value, label=None, 
                 parent=None, children=None, path=None):
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
        
           You must include at least one of parent, children, or path.
        """
        # assert path is not None and len(path) >= 1
        self.key = key
        self.value = value
        self.label = label or str(value)
        self.parent = parent
        self.children = children or []
        self.path = path
        self.root = None
        # self._connected = False
        
        if path:
            # we're the last item in path
            assert self.key == self.path[-1]
            # our parent is next to last
            self.parent = self.path[-2] if len(self.path) >= 2 else None
            # .. and the root is the first element
            self.root = self.path[0]
            
    def find_path(self, cache):
        if not self.path:
            if not self.parent:
                self.path = [self.key]
            else:
                parentpath = cache[self.parent].find_path(cache)
                self.path = parentpath + [self.key]
            self.root = self.path[0]
        return self.path

    def __json__(self):
        return self.__dict__
            
    def __repr__(self):  # pragma: nocover
        return "TreeNode(name=%s, key=%s, parent=%s, path=%s, children=%s)" % (
            self.label, self.key, self.parent, self.path, self.children
        ) 


class TreeDatasource(object):
    """Tree data source for src/widgets/tree.
    
       Note: the items you add to the tree must have the following methods 
       defined::
       
           .tree_key()   returning a unique key for the item
           .tree_node()  returning an instance of the TreeNode class (above)
           
       alternatively you can subclass and override `.unique(obj)` and 
       `.as_treenode(obj)`l
           
    """
    cache = {}  # xtype: Dict[Any, TreeNode] 
    roots = []
    depth = 0
    height = 0

    def __init__(self):
        """You must set at least one of the arguments to True.
        """
        self.cache = {}
        self.roots = []

    def __json__(self):
        return dict(cache=self.cache, roots=self.roots)

    def unique(self, obj):
        """Return a string value for obj, that is unique over all
           nodes in the tree.
        """
        return obj.tree_key()   # str(id(obj))  # pragma: nocover

    def as_treenode(self, obj):
        """Convert obj to a tree node (TreeNodeResource).
        """
        return obj.tree_node()

    def add_item(self, item):
        key = self.unique(item)
        node = self.cache.get(key)
        if node is None:
            node = self.as_treenode(item)
            self.cache[key] = node

    def add_items(self, items):
        if not items:
            return self
        for item in items:
            self.add_item(item)
        return self

    __iadd__ = add_items

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connect_generations()
        
    def connect_generations(self):
        # at this point self.cache contains all nodes in the tree

        # if we have children, add node as parent to each child
        for key, node in self.cache.items():
            for child in node.children:
                child_obj = self.cache[child]
                if not child_obj.parent:
                    child_obj.parent = key

        # have_parent, but maybe not path => traverse parents to root
        for node in self.cache.values():
            node.find_path(self.cache)
            
        # if not children, then: add each node as a child to its parent
        for key, node in self.cache.items():
            if node.parent:
                parent = self.cache[node.parent]
                if node.key not in parent.children:
                    parent.children.append(key)
                    
        self.roots = list({node.root for node in self.cache.values()})
        self.validate()

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
                prtree(c, depth + 1)

        for r in self.roots:
            prtree(r, 0)
        return out.getvalue()

    def validate(self):    # pragma: nocover
        """Validates the structure of the tree data source.
        """
        for k, node in self.cache.items():
            is_root = (node.root == node.key or len(node.path) == 1 or node.parent is None)

            if is_root:
                if len(node.path) != 1:
                    raise ValueError(jason.dump2(node))
                if node.root != node.key:
                    raise ValueError(jason.dump2(node))
                if node.key != k:
                    raise ValueError(jason.dump2(node))
                if node.parent is not None:
                    raise ValueError(jason.dump2(node))

            if len(node.children) != len(set(node.children)):
                raise ValueError(jason.dump2(node))

            if node.parent:
                if node.key not in self.cache[node.parent].children:
                    raise ValueError(jason.dump2(node))
        return True


class PathTreeDataSource(TreeDatasource):
    """The PathTreeDataSource resource is a hierarchical n-ary forrest data
       structure, where only the nodes on the path to the specified
       nodes do not have to be specified.

       For example, the tree::

           .
            `-- a
                `-- b
                    |-- c
                    `-- d

       can be specified using only the ``c`` and ``d`` nodes.
    """

    # noinspection PyMethodFirstArgAssignment
    def __init__(self, nodes=()):
        super(PathTreeDataSource, self).__init__()
        self += nodes

    def prefix_list(self, s, delim='/'):
        lst = s.split(delim)
        return [delim.join(lst[:i]) for i in range(1, len(lst))]

    def _add_missing_path_nodes(self):
        """Add nodes for intermediate path nodes that have not been explicitly
           added.
        """
        for node in list(self.cache.values()):
            for subnode in self.path_to(node):
                if subnode.key not in self.cache:
                    self.cache[subnode.key] = subnode

    def connect_generations(self):
        self._add_missing_path_nodes()
        super(PathTreeDataSource, self).connect_generations()
