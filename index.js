'use strict';

var coffee    =  require('coffee-script') 
  , convert   =  require('convert-source-map')
  , through   =  require('through')
  , crypto    =  require('crypto')
  , cache     =  {};

function getHash(data) {
  crypto
    .createHash('md5')
    .update(data)
    .digest('hex');
}

function compile(file, data) {
  var compiled = coffee.compile(data, { sourceMap: true, generatedFile: file, inline: true })
    , comment = convert
        .fromJSON(compiled.v3SourceMap)
        .setProperty('sources', [ file ]) 
        .toComment();

  return compiled.js + '\n' + comment;
}

module.exports = function (file) {
  if (!/\.coffee$/.test(file)) return through();
    
  var data = '';
  return through(write, end);
  
  function write (buf) { data += buf; }
  function end () {

    var hash = getHash(data)
      , cached = cache[file];

    if (!cached || cached.hash !== hash) {
      cache[file] = { compiled: compile(file, data), hash: hash };
    }   

    this.queue(cache[file].compiled);
    this.queue(null);
  }
};
