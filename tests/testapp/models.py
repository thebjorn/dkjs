# -*- coding: utf-8 -*-
from django.db import models


class MyModel(models.Model):
    month = models.CharField(max_length=20)
