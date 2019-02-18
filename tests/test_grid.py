import textwrap
from dkjs.grid import (
    ColumnGetter, Model, Column, _ModelFieldColumn, Row, Value, Grid
)
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

    buf = StringIO()
    g.write_csv(buf)
    # print(dir(buf))
    # FIXME: this is horribly broken!
    assert buf.getvalue() == (
        "b'Foo',b'Bar'\r\n"
        "b'fooval',b'barval'\r\n"
    )
    
    
def test_empty_grid_write_csv():
    buf = StringIO()
    Grid().write_csv(buf)
    # print(dir(buf))
    assert buf.getvalue() == "\r\n"
