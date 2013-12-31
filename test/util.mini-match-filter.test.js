'use strict';
var expect = require('chai').expect;
var Q = require('q');

var matchFilter = require('../lib/util/mini-match-filter');

describe('mini-match-filter', function(){

    it('takes an array of strings and an array of minimatches and returns a new array', function(){

        var fixture = [
            'changelog',
            'xml',
            'rss',
            'grunt-notify',
            'grunt-prompt',
            'shortid',
            'grunt-cat',
            'logging',
            'jobvite',
            'lean',
            'opower-jobs',
            'tramp'
        ];
        var results = fixture.filter(matchFilter(['grunt-*', '!*cat*', '!foobar']));

        expect(results).to.have.length(2);
        expect(results).to.contain('grunt-prompt');
        expect(results).to.contain('grunt-notify');
        expect(results).to.not.contain('grunt-cat');
        expect(results).to.not.contain('changelog');
    });
});