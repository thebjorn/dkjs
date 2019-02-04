# -*- coding: utf-8 -*-

"""The Datakortet Javascript package, dk.js.
"""

import setuptools

classifiers = """\
Development Status :: 3 - Alpha
Intended Audience :: Developers
Programming Language :: Python
Programming Language :: Javascript
Topic :: Software Development :: Libraries
"""

setuptools.setup(
    name='dkjs',
    version='0.0.1',
    packages=['dkjs'],
    install_requires=['ttcal'],
    url='https://github.com/thebjorn/dkjs',
    classifiers=[line for line in classifiers.split('\n') if line],
    long_description=open('README.md').read(),
    license='MIT',
    author='Bjorn Pettersen',
    author_email='bp@norsktest.no',
    description=''
)
