# -*- coding: utf-8 -*-

"""Test that all modules are importable.
"""

import dkdj.csvdata
import dkdj.datasources
import dkdj.decorators
import dkdj.grid
import dkdj.jason
import dkdj.mysql_select
import dkdj.templatetags
import dkdj.templatetags.dkdj_tags
import dkdj.views


def test_import_():
    "Test that all modules are importable."
    
    assert dkdj.csvdata
    assert dkdj.datasources
    assert dkdj.decorators
    assert dkdj.grid
    assert dkdj.jason
    assert dkdj.mysql_select
    assert dkdj.templatetags
    assert dkdj.templatetags.dkdj_tags
    assert dkdj.views
