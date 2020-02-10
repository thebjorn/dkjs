# -*- coding: utf-8 -*-

from .treenode import TreeNode
from .treeds import TreeDatasource


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
