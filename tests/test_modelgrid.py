# -*- coding: utf-8 -*-
from __future__ import print_function
import pytest
from django.contrib.auth.models import User

from dkjs import jason
from dkjs.grid import Column
from dkjs.views import ModelGrid


@pytest.mark.django_db
def test_modelgrid(rf):
    class MG(ModelGrid):
        model = User
        columns = ['username']
        
    view = MG.as_view()
    r = view(rf.get('!get-records'))
    assert r.status_code == 200
    val = dict(jason.loads(r.content))
    print(jason.dumps(val))
    assert val['rows'] == []
    assert len(val['cols']) == 1
    assert val['cols'][0]['name'] == 'username'
    assert val['cols'][0]['type'] == 'Char'


@pytest.mark.django_db
def test_modelgrid_sort(rf):
    class MG(ModelGrid):
        model = User
        columns = 'username email date_joined'.split()
        
        def get_queryset(self, request, *args, **kwargs):
            qs = super(MG, self).get_queryset(request, *args, **kwargs)
            return qs
        
        def get_columns(self, request, qs, object_list):
            columns = super(MG, self).get_columns(request, qs, object_list)
            
            @columns.append
            class full_name(Column):
                def value(self, item):
                    return item.get_full_name()
                
            return columns

    usr = User.objects.create_user('username', 'email@example.com', 'password', 
                                   first_name=u'hello', last_name=u'world')
    view = MG.as_view()
    r = view(rf.post('!get-records', {'s': '-username'}))
    assert r.status_code == 200
    val = dict(jason.loads(r.content))
    print(jason.dumps(val))
    rows = [dict(r) for r in val['rows']]
    print("ROWS:", rows)
    assert len(rows) == 1
    row = rows[0]
    assert row['k'] == 1
    assert row['c'] == [
        'username', 
        'email@example.com', 
        '@datetime:' + usr.date_joined.isoformat(),
        u'hello world'
    ]
    assert len(val['cols']) == 4
    assert val['cols'][0]['name'] == 'username'
    assert val['cols'][0]['type'] == 'Char'
    assert val['cols'][3]['name'] == 'full_name'
