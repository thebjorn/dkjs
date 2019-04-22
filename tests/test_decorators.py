# -*- coding: utf-8 -*-
# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

import random

import pytest

from django.contrib.auth.models import User, AnonymousUser
from django.core.exceptions import PermissionDenied
from django.utils.http import urlquote

from dkjs import decorators
from dkjs.views import SubcommandView

try:  # pragma: nocover
    from django.utils.encoding import force_text
except ImportError:  # pragma: nocover
    from django.utils.encoding import force_unicode as force_text


@pytest.fixture
def viewcls():
    def create_view_class(mixin):
        class M0(mixin, SubcommandView):
            ARGMAP = dict(arg='FOO')
            login_url = '/login-test-user/'
            redirect_field_name = 'goto-success'

            def dispatch(self, *args, **kwargs):
                # print "DISPATCH:", args, kwargs
                return super(M0, self).dispatch(*args, **kwargs)

            def foo(self, request):
                return 'foo'

        return M0
    return create_view_class


@pytest.fixture
def user():
    return User(username='foo%d' % random.randint(1, 100000))


def test_loginrequired_anonymous(rf, viewcls, user):
    view = viewcls(decorators.LoginRequiredMixin).as_view()
    request = rf.get('!foo')
    # user.is_authenticated = lambda:False
    request.user = AnonymousUser()

    response = view(request)
    print(response)
    assert response.status_code == 302
    assert response['Location'] == '/login-test-user/?goto-success=/' + urlquote('!foo')


def test_loginrequired_anonymous_exception(rf, viewcls):
    cls = viewcls(decorators.LoginRequiredMixin)
    cls.raise_exception = True
    view = cls.as_view()
    request = rf.get('!foo')
    # user.is_authenticated = lambda:False
    request.user = AnonymousUser()

    with pytest.raises(PermissionDenied):
        view(request)


def test_loginrequired_ok(rf, viewcls, user):
    view = viewcls(decorators.LoginRequiredMixin).as_view()
    request = rf.get('!foo')
    # user.is_authenticated = lambda:False
    request.user = user

    result = view(request)
    print(result)
    assert result == 'foo'
