var fs = require('fs');

var defaultFilename = 'jshint-output.html';

var wrStream;
var cssWriteStream;//=fs.createWriteStream("main.css");
var filename;
var fileExists=false;

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
    
    var path=filename.substring(0,filename.indexOf("/")+1);
    fs.exists(path+"main.css",(exists)=>{
        
        if(!exists){
            cssWriteStream=fs.createWriteStream(path+"main.css");
            var cssString="body{font-family: Verdana; font-size:10px; margin: 0;padding:0;}\n";
            cssString+=".grid{width: 40%;margin: 1.5em 0 1.2em 1.2em;padding: 1.5em;border: 1px solid #1d1d1d;}";
            cssString+=".grid h2{margin-top: 0;}";
            cssString+=".grid .cell{border-top: 1px solid #1d1d1d;padding: 0.5em;}";
            cssString+=".grid .cell span{font-weight: bold;color: #087ce2;}";
            cssString+=".grid .cell:last-child{border-bottom: 1px solid #1d1d1d;}";
            cssWriteStream.write(cssString);
        }
        
    });

    var out = [];
    var file = {};

    results.forEach(function (result, i) {
        var err = result.error;
        
        if(!fileExists){
            out.push('<html>\n\t<title>JSLint Output</title>\n\t<head>\n\t<link rel="stylesheet" href="main.css">\n</head>\n<body>');
        }
        if (!i) {
            // start off the output with the filename
            out.push('<div class="grid">\n');
            out.push('\t<h2>'+results.length + ' lint errors found in ' + result.file+'</h2>');
        }

        out.push('\n\t<div class="cell"> <span>[' + err.line + ',' + err.character + '](' + err.code + ')</span> ' + err.reason+'</div>');
        
        if(!fileExists){
            out.push('</div>\n\t</body>\n</html>');
        }
        
    });
    
    fs.exists(filename,(exists)=>{
        if(exists){
            fileExists=true;
            fs.appendFile(filename,out.join(','));
        }else{
            wrStream.write(out.join(','));
        }
    });
    
};
