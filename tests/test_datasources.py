# -*- coding: utf-8 -*-
import json

from dkdj.datasources import BoolToggleDataSource


class MyToggle(BoolToggleDataSource):
    val = False
    def __init__(self):
        super(MyToggle, self).__init__()

    def get_current_value(self, request, args, kw):
        return self.val

    def set_current_value(self, request, args, kw, param):
        self.val = param
        return param


def test_bool_toggle_datasource_update(rf):
    tds = MyToggle.as_view()
    request = rf.post('!toggle', data=json.dumps(dict(
        val=True
    )), content_type='application/json')

    response = tds(request)
    # print(type(response))
    # print(dir(response))
    res = json.loads(response.content)
    # print(json.dumps(res, indent=4))
    assert res['status']['code'] == 201
    assert res['status']['message'] == 'update'
    assert res['result']['value'] is False


def test_bool_toggle_datasource_ok(rf):
    tds = MyToggle.as_view()
    request = rf.post('!toggle', data=json.dumps(dict(
        val=False
    )), content_type='application/json')
    response = tds(request)
    # print(type(response))
    # print(dir(response))
    res = json.loads(response.content)
    # print(json.dumps(res, indent=4))
    assert res['status']['code'] == 200
    assert res['status']['text'] == 'ok'
    assert res['result']['value'] is True


def test_bool_toggle_datasource_value(rf):
    tds = MyToggle.as_view()
    request = rf.get('!value')
    response = tds(request)
    # print(type(response))
    # print(dir(response))
    res = json.loads(response.content)
    # print(json.dumps(res, indent=4))
    assert res['status']['code'] == 200
    assert res['status']['text'] == 'ok'
    assert res['result']['value'] is False


def test_bool_toggle_datasource_client_state_err(rf):
    tds = MyToggle.as_view()
    request = rf.post('!toggle', data=json.dumps(dict(
        val=None
    )), content_type='application/json')
    response = tds(request)
    # print(type(response))
    # print(dir(response))
    res = json.loads(response.content)
    print(json.dumps(res, indent=4))
    assert res['status']['code'] == 450
    assert res['status']['text'] == 'client sent invalid state'
    assert res['status']['message'] == 'error'


def test_bool_toggle_datasource_server_state_err(rf):
    tds = MyToggle
    tds.val = 42
    tds = tds.as_view()
    request = rf.post('!toggle', data=json.dumps(dict(
        val=True
    )), content_type='application/json')
    response = tds(request)
    # print(type(response))
    # print(dir(response))
    res = json.loads(response.content)
    print(json.dumps(res, indent=4))
    assert res['status']['code'] == 550
    assert res['status']['text'] == 'server has invalid state'
    assert res['status']['message'] == 'error'
