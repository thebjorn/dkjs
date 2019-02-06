# -*- coding: utf-8 -*-

"core.jason"

# pylint:disable=R0904, W0232, C0111, R0201, C0301
# R0904: Too many public methods
# W0232: [Class C. method __json__] Class has not __init__ method
# C0111: [Class C. method __json__] Missing docstring
# R0201: [Class C. method __json__] Method could be a function
# C0301: Line is too long

import datetime
import decimal
import ttcal
from dkjs import jason, DJANGO


def roundtrip(v):
    "Convenience function to thest the roundtrip (dump/eval)."
    return jason.json_eval(jason.dumps(v)) == v


def test_jason_eval():
    "Test the jason_eval function using the roundtrip convenience function."
    assert roundtrip([])
    assert roundtrip(['hello world'])
    assert roundtrip(['hello world'.split()])


def test_dumps():
    "Test the dumps function."
    assert jason.dumps(datetime.datetime(2012, 4, 2, 6, 12), indent=None) == '"@datetime:2012-04-02T06:12:00"'
    assert jason.dumps(decimal.Decimal('3.14159263')) == repr(float('3.14159263'))


@pytest.mark.skipif(not DJANGO)
def test_jasonval():
    "Test the jasonval method."
    response = jason.jsonval(['Hei', 'Verden', '2012'])
    print 'response:', response
    r = str(response)
    assert r.count('Hei') == 1
    assert r.count('Verden') == 1
    assert r.count('2012') == 1


def test_class_dumps():
    """Test the dump of the jason value of a class by using
       the __jason__ method.
    """
    class C:
        def __json__(self):
            return 42

    assert jason.dumps(C()) == '42'

    class D(object):
        def __init__(self):
            self.a = 42

    assert jason.json_eval(jason.dumps(D())) == {"a":42}


def test_set_dumps():
    assert jason.json_eval(jason.dumps(set())) == []
    assert jason.json_eval(jason.dumps({1, 2})) == [1, 2]
    assert jason.json_eval(jason.dumps(ttcal.Year(2017))) == {'year': 2017, 'kind': 'YEAR'}


def test_loads():
    val = '{"k":"@datetime:1970-05-02T06:10:00"}'
    jval = jason.loads(val)
    assert jval['k'] == datetime.datetime(1970, 5, 2, 6, 10)

    val = '{"k":"@date:1970-05-02"}'
    jval = jason.loads(val)
    assert jval['k'] == datetime.date(1970, 5, 2)

    val = u'{"k":"@døte:1970-05-02"}'
    jval = jason.loads(val)
    assert not isinstance(jval['k'], datetime.date)

    val = u'{"k":"@date1970-05-02"}'
    jval = jason.loads(val)
    assert not isinstance(jval['k'], datetime.date)

    val = u'{"k":42}'
    jval = jason.loads(val)
    assert jval['k'] == 42


@pytest.mark.skipif(not DJANGO)
def test_jsonp():
    assert 'JSON.parse(val)}("{\\"x\\":42}")' in str(jason.jsonp('cb', {'x':42}))
    assert 'cb(42)' in str(jason.jsonp('cb', 42))
  
