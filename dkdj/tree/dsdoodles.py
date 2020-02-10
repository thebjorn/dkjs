"""
Issues...

- path as string needs a separator that is not legal as an element
- path elements are not necessarily unique (but paths are)
- id of a node would have to be the full path to the node
- to create missing intermediate nodes (path-tree-ds), we need a way to find
  their label
    - how do we know that the parent of foo$bar$bas
      => has id == foo$bar
      => and label == bar ?
      
- is a solution to use a more grid-like approach?
  i.e. def get_queryset, get_filter, etc.?
- is a solution to have a id (possibly synthetic) to path mapping in the ds?

- observation..?
  => if the path elements are switchted to numbers,
     then a tree can be viewed as a sparse matrix
        t[c3][c42][...]     
      
      

"""
import django;django.setup()
from tt3.models import Project

from dkdj.tree import TreeNode
# from dkdj.tree import TreeDatasource, PathTreeDataSource, TreeNode
# 
# 
# def recent_projects(*a, **kw): 
#     return {}
# 
# 
# class ProjectTreeDs(TreeDatasource):
#     def get_queryset(self):
#         return recent_projects(self.user, cutoffdays=360)
# 
# 
# def myview(request):
#     ds = TreeDatasource()
#     ds += {p.id: p for p in recent_projects(request.user, cutoffdays=360)}
#     

class TreeDS(object):
    def __init__(self):
        self.cache = {}
        self.roots = []
        self.__counter = 0
        
    def __iadd__(self, node):
        self.cache[node.pk] = node
        return self

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connect_generations()
        
    def parent(self, node, create=False):
        try:
            return self.cache[node.parent], False
        except KeyError:
            n = TreeNode(
                pk=node.parent,
                label=node.path[-2],
                path=node.path[:-1],
                children=[node.pk],
                # parent=???,
                root=node.root,
            )
            return n, True
            # print(node.label, node.path)
        
    def _tmpid(self):
        self.__counter += 1
        return "t{}".format(self.__counter)

    def connect_generations(self):
        # TODO: (A) must find a way to apply all strategies at once...
        
        # if not children, then: add each node as a child to its parent
        items = self.cache.items()
        while items:
            print("ITEMS:", [pk for pk,n in items])
            pk, node = items.pop()
            
            # XXX: this must be done in a more sensible fashion.. (it's potentially O(n**2)
            # node.find_path(self.cache)    # solves (A)?
            
            print("  DOING:", pk, node)
            if node.parent:
                # we have a parent (id), find the parent and add node as a child
                parent, created = self.parent(node, create=True)
                if created:
                    print("CREATED:", parent)
                    self.cache[parent.pk] = parent
                    items.append((parent.pk, parent))
                if node.pk not in parent.children:
                    parent.children.append(pk)
            # XXX: if not node.parent and len(node.path) == 2:  
            elif len(node.path) == 2:  # solves (A)?
                # we're just below the root, use node.root (id) if we have it
                parent, created = self.parent(node, create=True)
                assert created
                parent.pk = node.root or self._tmpid()
                print("CREATED:", parent)
                self.cache[parent.pk] = parent
                items.append((parent.pk, parent))
                node.parent = parent.pk
                if node.pk not in parent.children:
                    parent.children.append(pk)
            elif len(node.path) > 2:  # solves (A)?
                p = TreeNode(
                    pk=self._tmpid(),
                    label=node.path[-2],
                    path=node.path[:-1],
                    children=[node.pk],
                    root=node.root
                )
                self.cache[p.pk] = p
                items.append((p.pk, p))
                node.parent = p.pk

        # # if we have children, add node as parent to each child
        # for key, node in self.cache.items():
        #     for child in node.children:
        #         try:
        #             child_obj = self.cache[child]
        #         except KeyError:
        #             raise ValueError("""
        #                 Node {}:{} is referencing a child with key={} which 
        #                 has not been added to the datasource.
        #             """.format(key, repr(node), child))
        #         if not child_obj.parent:
        #             child_obj.parent = key

        # # have_parent, but maybe not path => traverse parents to root
        # for node in self.cache.values():    # XXX: should this swap places with the next for-loop?
        #     node.find_path(self.cache)  # also sets node.root



        # node.root is set during node.find_path(..) above.
        self.roots = list({node.root for node in self.cache.values()})


def myview2(request):
    # recents = recent_projects(request.user, cutoffdays=360)
    # projects = Project.objects.filter(id__in=[134])
    # projects = Project.objects.filter(id__in=[27])
    projects = Project.objects.filter(id__in=[89,90,91])
    paths = {}

    for p in projects:
        # customer, proj_path = p.projectpath.split('$', 1)
        # path_parts = proj_path.split('$')
        # pth = p.projectpath.split('$')
        paths[p.projectpath] = p.id
        
    print("PATHS:", paths)
            
    with TreeDS() as ds:
        for p in projects:
            pth = p.projectpath.split('$')[1:]

            ds += TreeNode(
                pk=p.id,
                # pk=p.projectpath,
                label=p.name,
                path=pth,
                
                # parent='$'.join(pth[:-1]),
                # parent=paths['$'.join(pth[:-1])],
                parent=p.parent_id,
                
                # root='$'.join(pth[:2]),     # first item is customer..
                root=p.rootproj,     # first item is customer..
            )
        return ds
        # for node in list(ds):
        #     for pth_item in node.path[:-1]:
        #         if pth_item not in ds:
        #             ds += TreeNode(
        #                 key=pth_item,
        #                 value=None,
        #                 label=pth_item.rsplit('$', 1)[-1],
        #                 path=PathTreeDataSource.get_path(pth_item, '$')
        #             )
        # page.projects = ds

    # with PathTreeDataSource() as ds:
    #     for customer, projects in recents.items():
    #         for p in projects:
    #             pth = p.projectpath.split('$')
    #             print("PTH:", pth, p.name)
    #             ds += TreeNode(
    #                 pk=p.id,
    #                 label=p.name,
    #                 path=pth
    #             )
    #     # for node in list(ds):
    #     #     for pth_item in node.path[:-1]:
    #     #         if pth_item not in ds:
    #     #             ds += TreeNode(
    #     #                 key=pth_item,
    #     #                 value=None,
    #     #                 label=pth_item.rsplit('$', 1)[-1],
    #     #                 path=PathTreeDataSource.get_path(pth_item, '$')
    #     #             )
    #     page.projects = ds
    # 


if __name__ == "__main__":
    ds = myview2(42)
    print(ds).roots
    for k,v in ds.cache.items(): print(k, v)

    pths = ['/'.join(v.path) for v in ds.cache.values()]
    pths.sort()
    for p in pths:
        print p
