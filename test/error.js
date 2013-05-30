var test = require('tap').test;
var browserify = require('browserify');
var path = require('path');
var fs = require('fs');

var file = path.resolve(__dirname, '../example/error.coffee');
var source = fs.readFileSync(file).toString();
var transform = path.join(__dirname, '..');
var errLocation = {first_line: 4, first_column: 14, last_line: 4, last_column: 14};

test('transform error', function (t) {
    t.plan(7);

    var b = browserify([file]);
    b.transform(transform);

    b.bundle(function (error) {
        t.ok(error !== undefined, "error should be defined");
        t.ok(error.body !== undefined, "error.body should be defined");
        t.ok(error.file !== undefined, "error.file should be defined");
        t.ok(error.location !== undefined, "error should have an location hash");
        t.equal(error.body, source, "error.body should equal source");
        t.equal(error.file, file, "error.file should equal filename");
        t.deepEqual(error.location, errLocation, "error location should be correct");
    });
});
