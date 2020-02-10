# -*- coding: utf-8 -*-

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
