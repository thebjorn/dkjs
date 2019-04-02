# -*- coding: utf-8 -*-

"""dk.js template tags
"""
from django import template
from django.utils.safestring import mark_safe
from .. import jason


register = template.Library()


@register.filter
def jsonval(val):
    """Output `val` as a (json) value suitable for assigning to variables in
       javascript::

           var js_var = {{ python_var|jsonval }};

    """
    return mark_safe(jason.dumps(val))
