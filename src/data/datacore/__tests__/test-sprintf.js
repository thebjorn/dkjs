
// var assert = require('assert'),
//     sprintfjs = require('../src/sprintf.js'),
//     sprintf = sprintfjs.sprintf

import {sprintf} from "../sprintf";


describe('sprintfjs', function() {
    const pi = 3.141592653589793;

    it('should return formated strings for simple placeholders', function() {
        expect(sprintf('%%')).toEqual('%');
        expect(sprintf('%b', 2)).toEqual('10');
        expect(sprintf('%c', 65)).toEqual('A');
        expect(sprintf('%d', 2)).toEqual('2');
        expect(sprintf('%i', 2)).toEqual('2');
        expect(sprintf('%d', '2')).toEqual('2');
        expect(sprintf('%i', '2')).toEqual('2');
        expect(sprintf('%j', {foo: 'bar'})).toEqual('{"foo":"bar"}');
        expect(sprintf('%j', ['foo', 'bar'])).toEqual('["foo","bar"]');
        expect(sprintf('%e', 2)).toEqual('2e+0');
        expect(sprintf('%u', 2)).toEqual('2');
        expect(sprintf('%u', -2)).toEqual('4294967294');
        expect(sprintf('%f', 2.2)).toEqual('2.2');
        expect(sprintf('%g', pi)).toEqual('3.141592653589793');
        expect(sprintf('%o', 8)).toEqual('10');
        expect(sprintf('%o', -8)).toEqual('37777777770');
        expect(sprintf('%s', '%s')).toEqual('%s');
        expect(sprintf('%x', 255)).toEqual('ff');
        expect(sprintf('%x', -255)).toEqual('ffffff01');
        expect(sprintf('%X', 255)).toEqual('FF');
        expect(sprintf('%X', -255)).toEqual('FFFFFF01');
        expect(sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')).toEqual('Polly wants a cracker');
        expect(sprintf('Hello %(who)s!', {who: 'world'})).toEqual('Hello world!');
        expect(sprintf('%t', true)).toEqual('true');
        expect(sprintf('%.1t', true)).toEqual('t');
        expect(sprintf('%t', 'true')).toEqual('true');
        expect(sprintf('%t', 1)).toEqual('true');
        expect(sprintf('%t', false)).toEqual('false');
        expect(sprintf('%.1t', false)).toEqual('f');
        expect(sprintf('%t', '')).toEqual('false');
        expect(sprintf('%t', 0)).toEqual('false');
        expect(sprintf('%T', undefined)).toEqual('undefined');
        expect(sprintf('%T', null)).toEqual('null');
        expect(sprintf('%T', true)).toEqual('boolean');
        expect(sprintf('%T', 42)).toEqual('number');
        expect(sprintf('%T', 'This is a string')).toEqual('string');
        expect(sprintf('%T', Math.log)).toEqual('function');
        expect(sprintf('%T', [1, 2, 3])).toEqual('array');
        expect(sprintf('%T', {foo: 'bar'})).toEqual('object');
        expect(sprintf('%T', /<('[^']*'|'[^']*'|[^''>])*>/)).toEqual('regexp');
        expect(sprintf('%v', true)).toEqual('true');
        expect(sprintf('%v', 42)).toEqual('42');
        expect(sprintf('%v', 'This is a string')).toEqual('This is a string');
        expect(sprintf('%v', [1, 2, 3])).toEqual('1,2,3');
        expect(sprintf('%v', {foo: 'bar'})).toEqual('[object Object]');
        expect(sprintf('%v', /<("[^"]*"|'[^']*'|[^'">])*>/)).toEqual('/<("[^"]*"|\'[^\']*\'|[^\'">])*>/');
    });

    it('should return formated strings for complex placeholders', function() {
        // sign
        expect(sprintf('%d', 2)).toEqual('2');
        expect(sprintf('%d', -2)).toEqual('-2');
        expect(sprintf('%+d', 2)).toEqual('+2');
        expect(sprintf('%+d', -2)).toEqual('-2');
        expect(sprintf('%i', 2)).toEqual('2');
        expect(sprintf('%i', -2)).toEqual('-2');
        expect(sprintf('%+i', 2)).toEqual('+2');
        expect(sprintf('%+i', -2)).toEqual('-2');
        expect(sprintf('%f', 2.2)).toEqual('2.2');
        expect(sprintf('%f', -2.2)).toEqual('-2.2');
        expect(sprintf('%+f', 2.2)).toEqual('+2.2');
        expect(sprintf('%+f', -2.2)).toEqual('-2.2');
        expect(sprintf('%+.1f', -2.34)).toEqual('-2.3');
        expect(sprintf('%+.1f', -0.01)).toEqual('-0.0');
        expect(sprintf('%.6g', pi)).toEqual('3.14159');
        expect(sprintf('%.3g', pi)).toEqual('3.14');
        expect(sprintf('%.1g', pi)).toEqual('3');
        expect(sprintf('%+010d', -123)).toEqual('-000000123');
        expect(sprintf("%+'_10d", -123)).toEqual('______-123');
        expect(sprintf('%f %f', -234.34, 123.2)).toEqual('-234.34 123.2');
        expect(sprintf('%05d', -2)).toEqual('-0002');
        expect(sprintf('%05i', -2)).toEqual('-0002');
        expect(sprintf('%5s', '<')).toEqual('    <');
        expect(sprintf('%05s', '<')).toEqual('0000<');
        expect(sprintf("%'_5s", '<')).toEqual('____<');
        expect(sprintf('%-5s', '>')).toEqual('>    ');
        expect(sprintf('%0-5s', '>')).toEqual('>0000');
        expect(sprintf("%'_-5s", '>')).toEqual('>____');
        expect(sprintf('%5s', 'xxxxxx')).toEqual('xxxxxx');
        expect(sprintf('%02u', 1234)).toEqual('1234');
        expect(sprintf('%8.3f', -10.23456)).toEqual(' -10.235');
        expect(sprintf('%f %s', -12.34, 'xxx')).toEqual('-12.34 xxx');
        expect(sprintf('%2j', {foo: 'bar'})).toEqual('{\n  "foo": "bar"\n}');
        expect(sprintf('%2j', ['foo', 'bar'])).toEqual('[\n  "foo",\n  "bar"\n]');
        expect(sprintf('%.1f', 2.345)).toEqual('2.3');
        expect(sprintf('%5.5s', 'xxxxxx')).toEqual('xxxxx');
        expect(sprintf('%5.1s', 'xxxxxx')).toEqual('    x');

    });

    it('should return formated strings for callbacks', function() {
        expect(sprintf('%s', function() { return 'foobar' })).toEqual('foobar');
    });
});
