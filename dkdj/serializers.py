# -*- coding: utf-8 -*-
"""
Functions that mirror the functions in src/data/state/serializers.js
"""
from __future__ import print_function
import urllib
import json


def encode_url_value(val):
    return json.dumps(val, separators=',:').encode('base64')


def decode_url_value(val):
    return json.loads(val.decode('base64'))
