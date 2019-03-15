# -*- coding: utf-8 -*-
from django.db import models


class MyModel(models.Model):
    month = models.CharField(max_length=20)

    class Meta:
        app_label = 'mymodel'
        db_table = 'mymodel_mymodel'
