# -*- coding: utf-8 -*-
import pytest
from django.contrib.auth.models import User

from dkjs import jason
from dkjs.mysql_select import SelectStmt
from dkjs.views import SqlGrid


@pytest.mark.django_db
def test_sqlgrid(rf):
    usr = User.objects.create_user('username', 'email@example.com', 'password',
                                   first_name=u'hello', last_name=u'world')
    
    class MySqlGrid(SqlGrid):
        def get_sql_query(self, request, *args, **kwargs):
            return SelectStmt(
                select="username, email, date_joined",
                from_="auth_user",
                where="1=1",
                order_by="username",
                limit=100,
                offset=0
            )
        
    view = MySqlGrid.as_view()
    r = view(rf.post('!get-records'))
    print("R:", r)
    assert r.status_code == 200
    
    val = dict(jason.loads(r.content))
    print(jason.dumps(val))
    rows = [dict(r) for r in val['rows']]
    print("ROWS:", rows)
    assert len(rows) == 1
    row = rows[0]
    assert row['k'] == 0
    assert row['c'] == [
        'username',
        'email@example.com',
        '@datetime:' + usr.date_joined.isoformat(),
    ]
    assert len(val['cols']) == 3
    assert val['cols'][0]['name'] == 'username'
    assert val['cols'][0]['type'] == 'varchar'

