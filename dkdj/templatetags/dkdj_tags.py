# -*- coding: utf-8 -*-

"""dk.js template tags
"""
from django import template
from django.contrib.sites.shortcuts import get_current_site
from django.utils.safestring import mark_safe
from .. import jason


register = template.Library()


@register.inclusion_tag('dkdj/pagevar.html', takes_context=True)
def dkdj_create_page_var(context, varname='page'):
    return {
        'varname': varname,
        'user': context['user'],
        'site': get_current_site(context['request'])
    }
    

@register.filter
def jsonval(val):
    """Output `val` as a (json) value suitable for assigning to variables in
       javascript::

           var js_var = {{ python_var|jsonval }};

    """
    return mark_safe(jason.dumps(val))
