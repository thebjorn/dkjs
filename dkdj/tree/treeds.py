# -*- coding: utf-8 -*-
from dkdj import jason


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
