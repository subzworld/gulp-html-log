var fs = require('fs');

var defaultFilename = 'jshint-output.html';

var wrStream;
var filename;

module.exports = function (results, data, opts) {
    opts = opts || {};
    opts.filename = opts.filename || defaultFilename;

    if (wrStream && filename !== opts.filename) {
        wrStream.end();
        wrStream = null;
    }

    if (!wrStream) {
        wrStream = fs.createWriteStream(opts.filename);
        filename = opts.filename;
    }

    var out = [];
    var file = {};

    results.forEach(function (result, i) {
        var err = result.error;

        if (!i) {
            // start off the output with the filename
            out.push('<html><title>JSLint Output</title><body>');
            out.push('<div>'+results.length + ' lint errors found in ' + result.file+'</div>');
        }

        out.push('<div> [' + err.line + ',' + err.character + '](' + err.code + ') ' + err.reason+'</div>');
        if(i===results.length-1){
            out.push('</body></html>');
        }
        
    });

    wrStream.write(out.join('\n'));
};
