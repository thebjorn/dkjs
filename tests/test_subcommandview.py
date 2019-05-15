# -*- coding: utf-8 -*-
import pytest
from django import http

from dkdj.views import SubcommandView


@pytest.fixture
def viewcls():
    class M0(SubcommandView):
        ARGMAP = dict(arg='FOO')

        def dispatch(self, *args, **kwargs):
            # print "DISPATCH:", args, kwargs
            return super(M0, self).dispatch(*args, **kwargs)

        def foo(self, request):
            return 'foo'

        def bar_bar(self, request):
            return 'bar-bar'

        def one_arg(self, request, arg):
            return arg

        def default_arg(self, request, arg=42):
            return arg

        def kw_arg(self, request, arg=42, **kw):
            return arg, kw

    return M0


def test_callmethod_missing(rf, viewcls):
    view = viewcls.as_view()
    with pytest.raises(http.Http404):
        view(rf.get('!foo-foo'))

    with pytest.raises(http.Http404):
        view(rf.get('foo'))  # missing !


def test_callmethod_0(rf, viewcls):
    view = viewcls.as_view()
    assert view(rf.get('!foo')) == 'foo'
    assert view(rf.get('!bar-bar')) == 'bar-bar'


def test_callmethod_1(rf, viewcls):
    view = viewcls.as_view()
    assert view(rf.get('!one-arg'), 42) == 42
    with pytest.raises(TypeError):
        view(rf.get('!one-arg'))


def test_callmethod_default(rf, viewcls):
    view = viewcls.as_view()
    assert view(rf.get('!default-arg'), 24) == 24
    assert view(rf.get('!default-arg')) == 42
    assert view(rf.get('!default-arg'), pi=3.14, arg=24) == 24
    assert view(rf.get('!default-arg'), pi=3.14, FOO=24) == 24
    assert view(rf.get('!default-arg'), pi=3.14, bar=24) == 42


def test_callmethod_kw(rf, viewcls):
    view = viewcls.as_view()
    assert view(rf.get('!kw-arg'), 24) == (24, {})
    assert view(rf.get('!kw-arg')) == (42, {})
    assert view(rf.get('!kw-arg'), pi=3.14, arg=24) == (24, {'pi': 3.14})
    assert view(rf.get('!kw-arg'), pi=3.14, FOO=24) == (24, {'pi': 3.14})
    assert view(rf.get('!kw-arg'), pi=3.14, bar=24) == (42, {'pi': 3.14, 'bar':24})
