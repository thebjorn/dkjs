# -*- coding: utf-8 -*-


class TreeNode(object):
    """A data structure to store data for a single node in the tree.
    
       Args:
           label (str):     the label to display for this node
                            (if not provided the ``value`` will be used)
           
           pk (str?):        a unique id for the entire tree,
                            must be hashable.
           
           # value (str):     the value to return if this tree node 
           #                  is selected

           parent (str):    the key of the parent node
           
           children (list): a list of the keys to this node's 
                            direct children
           path (list):     a list of the keys from the root to this node
                            path[-1] must be equal to key
                            
           root:            the pk to the root node of the tree this node
                            belongs to.
    
       You must include at least one of parent, children, or path.
    """
    # XXX: do we need both key and value?
    
    def __init__(self, pk=None, label=None, 
                 parent=None, children=None, 
                 path=None, root=None):
        
        assert pk or path, "must have either pk or path"
        self.pk = pk
        self.label = label or str(pk)
        self.parent = parent
        self.children = children or []
        self.path = path
        self.root = root
        
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
        res = u"TreeNode(label=%s, pk=%s, parent=%s, path=%s, children=%s, root=%s)" % (
            self.label, self.pk, self.parent, self.path, self.children, self.root
        )
        return res.encode('u8')
