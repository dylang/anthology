#!/usr/bin/env node
'use strict';

var anthology = require('./anthology');
var q = require('q');
var asciitable = require('asciitable');
var argv = require('optimist')
    .default('username', 'dylang')
    .argv;
var options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        {field: 'name', name: "Module"},
        {field: 'downloads', name: "Downloads"},
        {field: 'stars', name: "Stars"},
        {field: 'days', name: "Age"},
        {field: 'versions', name: "Versions"},
        {field: 'popularity', name: 'popularity'},
        // {field: 'description',  name: "Description"},
    ],
};

if (argv.help || argv.h) {
    console.log("Usage: npm-anthology [--username USER] [repo...]");
    console.log("");
    console.log("Examples:");
    console.log("");
    console.log("    npm-anthology --username dylang anthology");
    console.log("    npm-anthology --username dylang *");
    process.exit(0);
}

var repos = ['*'];
if (argv._.length > 0) {
    repos = argv._
}

function sumStars(data) {
    return data.reduce(function(previous, data) {
        return previous + data.stars;
    }, 0);
}

function sumDownloads(data) {
    return data.reduce(function(previous, data) {
        return previous + data.downloads;
    }, 0);
}

anthology.forUser(argv.username, repos)
    .then(function(data) {
        data.push(
            {},
            { name: 'modules: ' + data.length },
            { name: 'downloads: ' + sumDownloads(data) },
            { name: 'stars: ' + sumStars(data) }
        );
        var table = asciitable(options, data);
        console.log(table);
    })
    .catch(function(err) {
        console.log('uncaught error', err, err.stack);
    });




