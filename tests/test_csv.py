# -*- coding: utf-8 -*-
import csv
# from io import BytesIO as StringIO

try:  # pragma: nocover
    from cStringIO import StringIO
    mkbuffer = lambda:StringIO()
    encode_csv = lambda x: x
    encode_rows = lambda rows: [[col.encode('latin-1') for col in row] for row in rows]
except ImportError:  # pragma: nocover
    from io import StringIO
    mkbuffer = lambda:StringIO(newline="")
    encode_csv = lambda data: data.encode('latin-1') 
    encode_rows = lambda x: x

from django import http


def rows_to_csv_data(rows):
    buf = mkbuffer()
    writer = csv.writer(buf)
    writer.writerows(encode_rows(rows))
    return encode_csv(buf.getvalue())


# def rows_to_csv_data(rows):
#     rows = [[col.encode('latin-1') for col in row] for row in rows]
#     buf = StringIO()
#     writer = csv.writer(buf)
#     writer.writerows(rows)
#     return buf.getvalue()


def test_rows_to_csv_data():
    rows = [
        [u'helloæ', u'worldø'],
        [u'goodbye', u'world\n'],
    ]
    binary_data = rows_to_csv_data(rows)
    assert binary_data == u'''helloæ,worldø\r\ngoodbye,"world\n"\r\n'''.encode('latin-1')
    
    # response = http.HttpResponse(content_type='text/csv')
    # response['Content-Disposition'] = 'attachment; filename=hello.csv'
    # response.write(binary_data)
    # 
    # assert response.serialize() == b'Content-Type: text/csv\r\nContent-Disposition: attachment; filename=hello.csv\r\n\r\nhello\xe6,world\xf8\r\n'
