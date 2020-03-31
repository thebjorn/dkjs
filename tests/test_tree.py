# -*- coding: utf-8 -*-
from __future__ import print_function
import json

from dkjason import jason
from dkdj.tree import TreeNode, TreeDatasource, PathTreeDataSource


class Section(object):
    def __init__(self, id, name, parent=None, path=None, children=None):
        self.id = id
        self.name = name
        self.parent = parent
        self.path = path
        self.children = children or []

    def tree_key(self):
        return self.id

    def tree_node(self):
        return TreeNode(
            key=self.tree_key(),
            value=self.id,
            label=self.name,
            parent=self.parent.tree_key() if self.parent else None,
            path=self.path,
            children=[child.tree_key() for child in self.children]
        )


treeds_result = {
    "cache": {
        "1": {
            "children": [
                2
            ],
            "key": 1,
            "label": "a",
            "parent": None,
            "path": [
                1
            ],
            "root": 1,
            "value": 1
        },
        "2": {
            "children": [
                3,
                4
            ],
            "key": 2,
            "label": "b",
            "parent": 1,
            "path": [
                1,
                2
            ],
            "root": 1,
            "value": 2
        },
        "3": {
            "children": [],
            "key": 3,
            "label": "c",
            "parent": 2,
            "path": [
                1,
                2,
                3
            ],
            "root": 1,
            "value": 3
        },
        "4": {
            "children": [],
            "key": 4,
            "label": "d",
            "parent": 2,
            "path": [
                1,
                2,
                4
            ],
            "root": 1,
            "value": 4
        }
    },
    "roots": [
        1
    ]
}


def test_parent():
    """
            `-- a  (root)
                `-- b
                    |-- c
                    `-- d
    """
    root = Section(id=1, name='a', parent=None)
    b = Section(id=2, name='b', parent=root)
    c = Section(id=3, name='c', parent=b)
    d = Section(id=4, name='d', parent=b)

    sections = [root, b, c, d]

    ds = TreeDatasource()
    with ds:
        ds += sections
        ds += []
    print(ds)  # coverage for __repr__
    assert ds.validate()
    # print jason.dumps(ds)
    assert json.loads(jason.dumps(ds)) == treeds_result


def test_children():
    """
            `-- a  (root)
                `-- b
                    |-- c
                    `-- d
    """
    d = Section(id=4, name='d')
    c = Section(id=3, name='c')
    b = Section(id=2, name='b', children=[c, d])
    root = Section(id=1, name='a', children=[b])

    sections = [root, b, c, d]

    ds = TreeDatasource()
    with ds:
        ds += sections
    # for node in ds.cache.values():
    #     print "NODE:", node
    assert ds.validate()
    # print jason.dumps(ds)
    assert jason.loads(jason.dumps(ds)) == treeds_result


def test_path():
    """
            `-- a  (root)
                `-- b
                    |-- c
                    `-- d
    """
    root = Section(id=1, name='a', path=[1])
    b = Section(id=2, name='b', path=[1, 2])
    c = Section(id=3, name='c', path=[1, 2, 3])
    d = Section(id=4, name='d', path=[1, 2, 4])

    sections = [root, b, c, d]

    ds = TreeDatasource()
    with ds:
        ds += sections
    # for node in ds.cache.values():
    #     print "NODE:", node
    assert ds.validate()
    # print jason.dumps(ds)
    assert jason.loads(jason.dumps(ds)) == treeds_result


vals = [line for line in """\
Customer/ProjA
Customer/ProjA/timer-høy/FOO-support
Customer/ProjB/BAR-prosjekt/barbara
Customer/ProjA/Webløsning/ProjA-Utvikling
Customer/ProjB/BAR-prosjekt/calendar
Customer/ProjB/BAR-prosjekt/M1 Acme - integrasjon
Customer/ProjB/BAR-prosjekt/M2 test
""".split('\n') if line.strip() and not line.startswith('#')]


# def prefix_list(lst, delim='/'):
#     return ['/'.join(lst[:i]) for i in range(1, len(lst))]


class PathStrTree(PathTreeDataSource):
    def unique(self, pathstr):
        return pathstr

    def as_treenode(self, pathstr):
        node = TreeNode(
            key=pathstr,
            value=pathstr,
            label=pathstr.rsplit('/', 1)[-1],
            path=self.prefix_list(pathstr, '/') + [pathstr]
        )
        return node

    def path_to(self, treenode):
        return [self.as_treenode(pfx)
                for pfx in self.prefix_list(treenode.value, '/')]


def _mktree(values):
    with PathStrTree() as t:
        t += values
        return t


def test_tds():
    print("VALS:", vals)
    ds = _mktree(vals)
    print(jason.dumps(ds.cache, indent=4))
    print(repr(ds))
    assert ds.validate()
