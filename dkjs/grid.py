# -*- coding: utf-8 -*-

"""Resource classes to marshal grid data.
"""
import csv
import pprint
import datetime
try:
    from django.template.defaultfilters import removetags
except ImportError:
    def removetags(txt, _):
        return txt
        
from django.db.models.fields import FieldDoesNotExist
from . import jason

try:
    unicode
except NameError:
    unicode = str


class ColumnGetter(object):
    """
    """
    def __get__(self, instance, owner):
        if instance is None:
            raise Exception("ColumnGetter is an instance descriptor.")
        self._instance = instance
        return self

    def all(self):
        return list(self)

    def __iter__(self):
        for fname in self._instance.model._meta.get_all_field_names():
            yield getattr(self, fname)

    def __getattr__(self, colname):
        if colname.startswith('_'):
            return object.__getattribute__(self, colname)

        def wrapper(**overrides):
            return _ModelFieldColumn(self._instance.model, colname, **overrides)
        wrapper.is_wrapper = True
        wrapper.__name__ = 'wrapper_ModelFieldColumn[%r, %r]' % (self._instance.model, colname)

        return wrapper


class Model(object):
    """Wrapper around a django model to extract e.g. column data.

       Usage::

            def get_columns(self, ...):
                column = grid.Model(MyModel).column
                return [
                    column.a,
                    column.b(label="BB"),
                    ...
                ]
    """
    column = ColumnGetter()

    def __init__(self, model):
        self.model = model


class Column(object):
    """A column in a `Grid`.
    """
    name = ''
    label = ''
    sortable = None
    sort_field = None
    widget = None           # dkjs widget type
    data = None             # data for the widget
    url = None              # url datasource for the widget
    datatype = None
    _pos = 0

    def __init__(self, *args, **kw):
        # need to assign to self.xx to get attributes into self.__dict__,
        # which we use for json conversion.
        if args:
            kw['name'] = args[0]
        self.name = self.name or kw.get('name') or self.__class__.__name__
        self.label = self.label or kw.get('label') or self.name.title()
        self.sortable = self.sortable
        if self.sortable is None:
            self.sortable = kw.get('sortable', True)
        if self.sortable:
            if self.sort_field is None:
                self.sort_field = kw.get('sort_field', self.name)
        self.datatype = self.datatype or kw.get('datatype') or 'text'
        self.widget = self.widget or kw.get('widget') or (
            self.datatype.title() + 'Widget')
        self.data = self.data or kw.get('data')
        self.url = self.url or kw.get('url')

    def __repr__(self):
        return 'Column(**%s)' % pprint.pformat(self.__json__())

    def _value(self, item):
        "Private interface to value()"
        return self.value(item)

    def value(self, item):
        """Should be overriden in sub-classes to provide the value for this
           column for the row based on `item`.  The default implementation
           gets the attribute from item based on our class name, ie. if the
           column sub-class is::

               class work(ColumnResource):
                   ...

           then the default `value()` implementation will return `item.work`.
        """
        return getattr(item, self.name)

    def __json__(self):
        res = {}
        res.update(self.__dict__)
        res['type'] = res['datatype']
        del res['datatype']
        return res


class _ModelFieldColumn(Column):
    """Create a column resource from a field on a model. Use from Model above.
    """
    TYPES = {
        'varchar': 'Text',
        'positiveinteger': 'Int',

    }

    def __init__(self, model, field_name, **overrides):
        self.name = field_name
        try:
            field, _model, direct, m2m = model._meta.get_field_by_name(field_name)
        except FieldDoesNotExist:
            self.label = field_name
            self.datatype = None
        else:
            self.label = field.verbose_name if hasattr(field, 'verbose_name') else field_name
            self.datatype = self._get_datatype(field)
            # self.widget = ???
            if hasattr(field, 'rel') and hasattr(field, 'get_choices') and field.rel:
                self.data = field.get_choices()
            for k, v in overrides.items():
                setattr(self, k, v)
        super(_ModelFieldColumn, self).__init__()

    def _get_datatype(self, django_field):
        try:
            ftype = django_field.get_internal_type()
        except AttributeError:
            return 'text'
        else:
            if ftype.endswith('Field'):
                ftype = ftype[:-len('Field')]
            if 'varchar' in ftype.lower():
                ftype = 'text'
            if 'integer' in ftype.lower():
                ftype = 'int'
            return {
                'ForeignKey': 'SelectWidget',
            }.get(ftype, ftype)


class Row(object):
    """A row in a `Grid`.
    """

    def __init__(self, key=None, cells=None):
        self.key = key
        self.cells = cells or []

    def __getitem__(self, n):
        return self.cells[n].value

    def value(self, column):
        return self.cells[column._pos].value

    def sortvalue(self, column):
        """Return a sortable value (some Python types cannot be compared
           to None anymore).
        """
        val = self.value(column)

        if val is None:
            dtype = column.datatype
            if dtype == 'datetime':
                return datetime.datetime(1, 1, 1, 0, 0, 0)
            if dtype == 'date':
                return datetime.date(1, 1, 1)

        return val  # give up and hope for the best..?

    def __json__(self):
        return dict(k=self.key, c=self.cells)


class Value(object):
    def __init__(self, val=None, fmt=None):
        self.value = val
        self.fmtval = fmt

    @property
    def sortval(self):
        """Value used for sorting on a column.
        """
        if self.value is not None:
            return self.value

    @property
    def fmt(self):
        return self.fmtval if self.fmtval is not None else unicode(self.value or "")

    def __json__(self):
        res = dict(v=self.value)
        if self.fmtval is not None:
            res['f'] = self.fmtval
        return res


class Grid(object):
    """Grid is the server side version of a dk.data.DataSource.

       It is important to note that this is not a query set, or a result set,
       or a list of model instances -- although all of those can be the data
       source for the `GridDataResource`.  This has the advantage that it makes
       it much easier to provide grid data for joins, calculated columns, and
       data that doesn't come from a database.

    """

    def __init__(self, cols=None, rows=None, info=None):
        self.cols = cols or []
        self.rows = rows or []
        self.info = info
        self._colpos = {}
        for i, col in enumerate(self.cols):
            self._colpos[col.name] = i
            col._pos = i

    def sort(self, *keys):
        for key in reversed(keys):
            reverse = False
            if key.startswith('-'):
                key = key[1:]
                reverse = True
            pos = self._colpos[key]
            col = self.cols[pos]

            def rowkey(r):
                return r.sortvalue(col)

            self.rows.sort(key=rowkey, reverse=reverse)

    def __json__(self):
        return self.to_json()

    def to_json(self):
        return {
            'rows': self.rows,
            'cols': self.cols,
            'info': self.info
        }

    def write_csv(self, fp, delimiter=','):
        """Write comma separated values to the file-like object `fp`.
           `fp` must be supported by the `csv.writer()` constructor.
        """
        writer = csv.writer(fp, delimiter=delimiter)
        resrows = [[col.label.encode('l1', errors='ignore')
                    for col in self.cols]]

        for record in self.rows:
            row = []
            for field in record.cells:
                if hasattr(field, 'fmt'):
                    val = removetags(field.fmt, 'a small img details').strip()
                else:
                    val = field
                if isinstance(val, datetime.datetime):
                    val = val.strftime("%Y.%m.%d %H:%M:%S")
                if val == None:
                    val = ''
                if isinstance(val, object):
                    try:
                        val = unicode(val)  # assume everything is kosher
                    except:
                        # revert to something working but ugly..
                        val = unicode(repr(val), 'utf-8')
                row.append(val.encode('l1', errors='ignore'))
            resrows.append(row)

        writer.writerows(resrows)
        return fp

    def __repr__(self):
        return jason.dumps(self)
