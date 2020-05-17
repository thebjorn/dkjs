# -*- coding: utf-8 -*-
# pylint:disable=too-few-public-methods
import traceback
from django.conf import settings
from .views import SubcommandView
from . import jason
import logging
log = logging.getLogger(__name__)


class State(object):
    def __init__(self, value):
        self.value = value

    def __repr__(self):  # pragma: nocover
        return 'State(%r)' % self.value

    def __json__(self):
        return self.__dict__


class MessageStatus(object):
    def __init__(self, code, message=None, text=None):
        self.code = code
        self.message = message
        if text is not None:
            self.text = text
        elif 200 <= code < 300:
            self.text = 'ok'
        elif 300 <= code < 400:
            self.text = 'redirect'
        elif 400 <= code < 500:
            self.text = 'client-error'
        elif 500 <= code < 600:
            self.text = 'server-error'
        else:
            self.text = 'unknown'

    def __str__(self):  # pragma: nocover
        return '%d %s' % (self.code, self.text)

    def __json__(self):
        res = dict(
            code=self.code,
            text=self.text,
        )
        if self.message:
            res['message'] = self.message
        return res


class ToggleMessage(object):
    def __init__(self, status, result=None, updates=None):
        # print "TOGGLE_MSG_INIT:", status, result, updates
        self.status = status
        self.result = result
        self.updates = updates or {}

    def __json__(self):
        res = dict(
            status=self.status.__json__(),
        )
        if self.result is not None:
            res['result'] = self.result
        if self.updates:
            res['updates'] = self.updates
        return res


class ToggleView(SubcommandView):
    def __init__(self, states):
        self.states = states
        super(ToggleView, self).__init__()

    def __json__(self):
        return self.states

    def __repr__(self):  # pragma: nocover
        return repr(self.states)
    __str__ = __repr__

    def result(self, togglemsg):
        r = jason.response(
            self.request,
            togglemsg
        )
        r['X-dkmsg-status'] = str(togglemsg.status.code)   # FIXME: rfc6648
        log.debug('Sending: %r', r)
        # print("SENDING:", r)
        return r

    def value(self, request, *args, **kw):
        return self.result(ToggleMessage(
            MessageStatus(200, 'ok'),
            self.states[self.get_current_value(request, args, kw)]
        ))

    def get_current_value(self, request, args, kw):  # pragma: nocover
        raise NotImplementedError

    def set_current_value(self, request, args, kw, param):  # pragma: nocover
        raise NotImplementedError


class BoolToggleDataSource(ToggleView):
    """Base class for boolean widgets.

       Usage::

           class MyToggle(BoolToggleDataSource):
               def __init__(self):
                   self._val = False
                   super(MyToggle, self).__init__()

               def get_current_value(self, request, args, kw):
                   return self._val

               def set_current_value(self, request, args, kw, param):
                   self._val = param
                   return param

       .. note:: you should set your value to ``param`` in ``set_current_value``,
                 and return this value unchanged.
                 
    """
    STATUS_OK = MessageStatus(200)
    STATUS_UPDATE = MessageStatus(201, 'update', 'update')
    STATUS_CLIENT_STATE_ERR = MessageStatus(450, 'error', 'client sent invalid state')
    STATUS_CLIENT_MISSING_FIELD = MessageStatus(451, 'error', 'client sent invalid state')
    STATUS_SERVER_STATE_ERR = MessageStatus(550, 'error', 'server has invalid state')
    STATUS_UKNWN_ERROR = MessageStatus(500, 'unknown error')

    def __init__(self):
        super(BoolToggleDataSource, self).__init__({
            True: State(True),
            False: State(False)
        })

    # redefining abstract mehtods..
    def get_current_value(self, request, args, kw):  # pragma: nocover
        raise NotImplementedError

    def set_current_value(self, request, args, kw, param):  # pragma: nocover
        raise NotImplementedError

    def toggle(self, request, *args, **kw):
        """Toggle the boolean value.

           The client should send its current value as json::

               {'val': true}

           in a perfect world, where the client and server are in sync, this
           would be equal to the server's value (as returned by
           ``.get_current_value()``).  The server will then respond with::

               {
                   "result": {
                       "value": xxx
                   },
                   "status": {
                       "code": 200,
                       "text": "ok"
                   }
               }

           the ``result`` has the new value, although the client is assumed to
           have set this value pre-emptively.

           If the value doesn't match the server's value, the server will return::

               {
                   "result": {
                       "value": xxx
                   },
                   "status": {
                       "code": 201,
                       "message": "update",
                       "text": "update"
                   }
               }

           meaning that the client needs to update its value (since the value
           the client has is stale).

        """
        try:
            # if 'val' not in request.json:
            #     return self.result(ToggleMessage(
            #         MessageStatus(
            #             451,
            #             "client must send its current value in the field 'val'"
            #         )
            #     ))

            # verify that client value is valid
            client_val = request.json['val']
            if client_val not in self.states:
                return self.result(ToggleMessage(
                    self.STATUS_CLIENT_STATE_ERR,
                ))

            # verify that server value is valid
            current_val = self.get_current_value(request, args, kw)
            if current_val not in self.states:
                return self.result(ToggleMessage(
                    self.STATUS_SERVER_STATE_ERR
                ))

            # check if client has a stale value and send an update
            if client_val != current_val:
                # client value is outdated, send correct current value
                # print "CLIENT_VAL:", client_val, "CURRENT_VAL:", current_val
                return self.result(ToggleMessage(
                    self.STATUS_UPDATE,
                    self.states[current_val],

                ))

            # set the opposite value, and return an ok signal to the client
            # print("CALLING_SET_CUR_VAL:", args, kw, not current_val)
            # import pdb;pdb.set_trace()
            value = self.set_current_value(request, args, kw, not current_val)
            # print("OK_SET_VALUE:", value)
            return self.result(ToggleMessage(
                self.STATUS_OK,
                self.states[value]
            ))
        except Exception:  # pragma: nocover
            if settings.DEBUG or settings.TESTING:
                # provide the traceback on the javascript consolee if we're
                # in debug mode
                tb = traceback.format_exc()
                print("Sending error:\n", tb)
                return self.result(ToggleMessage(
                    MessageStatus(500, 'unknown error:\n%s' % tb)
                ))
            else:
                return self.result(ToggleMessage(
                    self.STATUS_UKNWN_ERROR
                ))
                # return self.result('error', 'unknown error: %s' % e, 500)
