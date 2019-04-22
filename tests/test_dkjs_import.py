# -*- coding: utf-8 -*-

"""Test that all modules are importable.
"""

import dkjs.csvdata
import dkjs.datasources
import dkjs.decorators
import dkjs.grid
import dkjs.jason
import dkjs.mysql_select
import dkjs.templatetags
import dkjs.templatetags.dkjs_tags
import dkjs.views


def test_import_():
    "Test that all modules are importable."
    
    assert dkjs.csvdata
    assert dkjs.datasources
    assert dkjs.decorators
    assert dkjs.grid
    assert dkjs.jason
    assert dkjs.mysql_select
    assert dkjs.templatetags
    assert dkjs.templatetags.dkjs_tags
    assert dkjs.views
