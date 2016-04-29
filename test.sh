#!/bin/bash

export NODE_ENV='test'
mocha test/*Spec.js -R spec -t 12000 --globals hasCert
#END
