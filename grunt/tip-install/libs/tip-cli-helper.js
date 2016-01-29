module.exports = function (grunt) {
  var _ = grunt.util._,
    util = require('util'),
    path = require('path');


  var toXML = function xml(json, options) {
    var XML_CHARACTER_MAP = {
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
        '<': '&lt;',
        '>': '&gt;'
      },
      result = options.header ? '<?xml version="1.0" encoding="UTF-8"?>' : '',
      type = json.constructor.name;

    options.header = false;

    if(type==='Array'){
      json.forEach(function(node){
        result += xml(node, options);
      });

    } else if(type ==='Object' && typeof json === "object") {

      Object.keys(json).forEach(function(key){
        if(key!==options.attrkey){
          var node = json[key],
            attributes = '';

          if(options.attrkey && json[options.attrkey]){
            Object.keys(json[options.attrkey]).forEach(function(k){
              attributes += util.format(' %s="%s"', k, json[options.attrkey][k]);
            });
          }
          var inner = xml(node,options);

          if(inner){
            result += util.format("<%s%s>%s</%s>", key, attributes, xml(node,options), key);
          } else {
            result += util.format("<%s%s/>", key, attributes);
          }
        }
      });
    } else {
      return json.toString()
        .replace(/([&"<>''])/g, function(str, item) {
          return XML_CHARACTER_MAP[item];
        });
    }

    return result;
  };
  return {
    toXML: toXML
  };
};
