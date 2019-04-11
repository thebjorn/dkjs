# -*- coding: utf-8 -*-
from django.contrib.auth.decorators import login_required

from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import ImproperlyConfigured, PermissionDenied
from django.utils.decorators import method_decorator
from django.utils.encoding import force_text

# from braces..


class AccessMixin(object):
    """
    'Abstract' mixin that gives access mixins the same customizable
    functionality.
    """
    login_url = None
    raise_exception = False  # Default whether to raise an exception to none
    redirect_field_name = REDIRECT_FIELD_NAME  # Set by django.contrib.auth

    def get_login_url(self):
        """
        Override this method to customize the login_url.
        """
        login_url = self.login_url or settings.LOGIN_URL
        if not login_url:
            raise ImproperlyConfigured(
                "Define %(cls)s.login_url or settings.LOGIN_URL or override "
                "%(cls)s.get_login_url()." % {"cls": self.__class__.__name__})

        return force_text(login_url)

    def get_redirect_field_name(self):
        """
        Override this method to customize the redirect_field_name.
        """
        if self.redirect_field_name is None:
            raise ImproperlyConfigured(
                "%(cls)s is missing the "
                "redirect_field_name. Define %(cls)s.redirect_field_name or "
                "override %(cls)s.get_redirect_field_name()." % {
                    "cls": self.__class__.__name__})

        return self.redirect_field_name


class UserPassesTestMixin(AccessMixin):
    """
    CBV Mixin allows you to define test that every user should pass
    to get access into view.

    Class Settings
        `user_passes_test` - This is required to be a method that takes user
            instance and return True or False after checking conditions.
        `login_url` - the login url of site
        `redirect_field_name` - defaults to "next"
        `raise_exception` - defaults to False - raise 403 if set to True

    """

    def user_passes_test(self, user):
        raise NotImplementedError(
            "%(cls)s is missing implementation of the "
            "test_func method. You should write one." % {
                "cls": self.__class__.__name__})

    def dispatch(self, request, *args, **kw):
        user_test_result = self.user_passes_test(request.user)

        if not user_test_result:  # If user don't pass the test
            if self.raise_exception:  # *and* if an exception was desired
                raise PermissionDenied
            else:
                return redirect_to_login(request.get_full_path(),
                                         self.get_login_url(),
                                         self.get_redirect_field_name())
        return super(UserPassesTestMixin, self).dispatch(request, *args, **kw)


class LoginRequiredMixin(AccessMixin):
    """
    View mixin which verifies that the user is authenticated.

    NOTE:
        This should be the left-most mixin of a view, except when
        combined with CsrfExemptMixin - which in that case should
        be the left-most mixin.
    """

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            if self.raise_exception:
                raise PermissionDenied  # return a forbidden response
            else:
                return redirect_to_login(request.get_full_path(),
                                         self.get_login_url(),
                                         self.get_redirect_field_name())

        return super(LoginRequiredMixin, self).dispatch(
            request, *args, **kwargs)


class PermissionRequiredMixin(AccessMixin):
    """
    View mixin which verifies that the logged in user has the specified
    permission.

    Class Settings
    `permission_required` - the permission to check for.
    `login_url` - the login url of site
    `redirect_field_name` - defaults to "next"
    `raise_exception` - defaults to False - raise 403 if set to True

    Example Usage

        class SomeView(PermissionRequiredMixin, ListView):
            ...
            # required
            permission_required = "app.permission"

            # optional
            login_url = "/signup/"
            redirect_field_name = "hollaback"
            raise_exception = True
            ...
    """
    permission_required = None  # Default required perms to none

    def dispatch(self, request, *args, **kwargs):
        # Make sure that the permission_required attribute is set on the
        # view, or raise a configuration error.
        if self.permission_required is None:
            raise ImproperlyConfigured(
                "'PermissionRequiredMixin' requires "
                "'permission_required' attribute to be set.")

        # Check to see if the request's user has the required permission.
        has_permission = request.user.has_perm(self.permission_required)

        if not has_permission:  # If the user lacks the permission
            if self.raise_exception:  # *and* if an exception was desired
                raise PermissionDenied  # return a forbidden response.
            else:
                return redirect_to_login(request.get_full_path(),
                                         self.get_login_url(),
                                         self.get_redirect_field_name())

        return super(PermissionRequiredMixin, self).dispatch(
            request, *args, **kwargs)


def class_view_decorator(fndecorator):
    """Convert a function decorator into a class based decorator
       ::

           @class_view_decorator(login_required)
           class MyGrid(dkjs.views.ModelGrid):
               ...

    """
    def decorator(cls=None, *args, **kwargs):
        cls.dispatch = method_decorator(fndecorator)(cls.dispatch)
        return cls

#         if cls is not None:
#             # decorator applied without parameters
#             if not hasattr(cls, 'dispatch'):
#                 raise TypeError('Class based views must have a dispatch method.')
#             orig = cls.dispatch
#             modified = method_decorator(fndecorator(*args, **kwargs))(orig)
#             cls.dispatch = modified
#             return cls
#         else:
#             def cls_decorator(cls):
#                 cls.dispatch = method_decorator(fndecorator)(cls.dispatch)
#                 return cls
#             return cls_decorator
    return decorator


def make_cbv_decorator(fndecorator):
    """Create a class decorator based on a function decorator that takes
       arguments::

           LoginRequired = make_cbv_decorator(login_required)

           @LoginRequired(login_url='/foo/')
           class MyGrid(dkjs.views.ModelGrid):
              ...

    """
    def curry(*args, **kwargs):
        return class_view_decorator(fndecorator(*args, **kwargs))
    return curry


xLoginRequired = make_cbv_decorator(login_required)


# from https://djangosnippets.org/snippets/2495/
def LoginRequired(cls=None, **login_args):
    """
    Apply the ``login_required`` decorator to all the handlers in a class-based
    view that delegate to the ``dispatch`` method.

    Optional arguments
    ``redirect_field_name`` -- Default is ``django.contrib.auth.REDIRECT_FIELD_NAME``
    ``login_url`` -- Default is ``None``

    See the documentation for the ``login_required`` [#]_ for more information
    about the keyword arguments.

    Usage:
      @LoginRequired
      class MyListView (ListView):
        ...

    .. [#] https://docs.djangoproject.com/en/dev/topics/auth/#the-login-required-decorator

    """
    if cls is not None:
        # Check that the View class is a class-based view. This can either be
        # done by checking inheritance from django.views.generic.View, or by
        # checking that the ViewClass has a ``dispatch`` method.
        if not hasattr(cls, 'dispatch'):
            raise TypeError(('View class is not valid: %r.  Class-based views '
                             'must have a dispatch method.') % cls)

        original = cls.dispatch
        modified = method_decorator(login_required(**login_args))(original)
        cls.dispatch = modified

        return cls

    else:
        # If ViewClass is None, then this was applied as a decorator with
        # parameters. An inner decorator will be used to capture the ViewClass,
        # and return the actual decorator method.
        def inner_decorator(inner_cls):
            return LoginRequired(inner_cls, **login_args)

        return inner_decorator
