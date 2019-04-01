# -*- coding: utf-8 -*-
import dkjs
import dkjs.apps
import dkjs.decorators
import dkjs.grid
import dkjs.grid_resource
import dkjs.jason
import dkjs.mysql_select
import dkjs.publish
import dkjs.resource
import dkjs.views
import dkjs.templatetags
import dkjs.templatetags.dkjs_tags


def test_import_dkjs():
    assert dkjs
    assert dkjs.apps
    assert dkjs.decorators
    assert dkjs.grid
    assert dkjs.grid_resource
    assert dkjs.jason
    assert dkjs.mysql_select
    assert dkjs.publish
    assert dkjs.resource
    assert dkjs.views
    assert dkjs.templatetags
    assert dkjs.templatetags.dkjs_tags
