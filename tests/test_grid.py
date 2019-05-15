# -*- coding: utf-8 -*-
import textwrap

from django import http

from dkdj.grid import (
    ColumnGetter, Model, Column, _ModelFieldColumn, Row, Value, Grid
)
try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO


def test_columngetter():
    assert ColumnGetter()
    
    
def test_model():
    assert Model
    
    
def test_column():
    assert Column()
    
    
def test_modelfield_column():
    assert _ModelFieldColumn
    
    
def test_row():
    assert Row()
    
    
def test_value():
    assert Value().__json__() == {'v': None}
    assert Value(42, 'forty-two').__json__() == {'v': 42, 'f': 'forty-two'}
    
    
def test_empty_grid_tojson():
    assert Grid().to_json() == dict(rows=[], cols=[], info=None)
    
    
def test_grid_tojson():
    g = Grid(
        cols=[
            Column(name='foo'),
            Column(name='bar'),
        ],
        rows=[
            Row(key=42, cells=[
                Value('f', 'fooval'),
                Value('v', 'barval')
            ])
        ],
        info=42
    )
    jsn = g.to_json()
    assert jsn['cols'][0].label == "Foo"
    assert g.rows[0][1] == 'v'
    assert g.rows[0].value(g.cols[1]) == 'v'
    assert g.rows[0].sortvalue(g.cols[1]) == 'v'

    assert g.csv_binary_data() == (
        b"Foo,Bar\r\n"
        b"fooval,barval\r\n"
    )
    
    
def test_empty_grid_write_csv():
    assert Grid().csv_binary_data() == b"\r\n" 


def test_csv_response():
    g = Grid(
        cols=[
            Column(name='foo'),
            Column(name='bar'),
        ],
        rows=[
            Row(key=42, cells=[
                Value('f', u'blå'),
                Value('v', u'bær')
            ])
        ],
        info=42
    )
    
    response = http.HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=hello.csv'
    g.write_csv(response)

    assert response.serialize() == b'Content-Type: text/csv\r\nContent-Disposition: attachment; filename=hello.csv\r\n\r\nFoo,Bar\r\nbl\xe5,b\xe6r\r\n'

