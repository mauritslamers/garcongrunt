var SC = require('sc-runtime');

var tools = require('./tools');
var pathjoin = tools.path.join;

// Framework class
module.exports = SC.Object.extend({
  path: null,
  combineScripts: false,
  combineStylesheets: true,
  minifyScripts: false,
  minifyStylesheets: false,
  belongsTo: null, // is set whenever the framework is part of a bigger framework or app

  gruntConcat: 'concat',
  gruntStyleSheetProcessor: 'compass',
  //gruntConfig: null,

  srcPath: function(){
    return this.get('path');
  }.property('path').cacheable(),

  basePath: function(){
    var ret = {};
    ret[this.get('name')] = this.get('path');
    return ret;
  }.property('path').cacheable(),

  name: function(){
    var ret = tools.path.basename(this.get('path'));
    return ret;
  }.property('path').cacheable(),

  fullName: function(){
    var bt = this.get('belongsTo');
    var ret = this.get('name');
    if(bt){
      ret = pathjoin(bt.get('name'),ret);
    }
    return ret;
  }.property('path','belongsTo').cacheable(),

  tmpPath: function(){
    var p = this.get('path');
    var ret = p.replace(/(^apps|bundles|frameworks|^themes|([a-z]+)\.lproj|resources)\//g, '');
    var bt = this.get('belongsTo');
    if(bt) ret = tools.path.join(bt.get('name'),ret);
    return tools.path.join("cache","tmp",ret);
  }.property('path').cacheable(),

  destPath: function(){
    var p = this.get('path');
    var ret = p.replace(/(^apps|bundles|frameworks|^themes|([a-z]+)\.lproj|resources)\//g, '');
    var bt = this.get('belongsTo');
    if(bt) ret = tools.path.join(bt.get('name'),ret);
    return tools.path.join("cache","dev",ret);
  }.property('path').cacheable(),

  gruntConfig: function(){
    var p = this.get('path'), tmp = this.get('tmpPath'),
        ret = {}, cssDest, scriptsDest,
        gruntConcat = this.get('gruntConcat'),
        gruntCSS = this.get('gruntStyleSheetProcessor');

    // stylesheets first
    if(this.get('combineStylesheets')){
      cssDest =  pathjoin(tmp,this.get('name') + ".css");
      ret[gruntConcat] = {
        css: {
          src: pathjoin(p,"**/*.css"),
          dest: cssDest
        }
      };
      ret[gruntCSS] = {
        src: cssDest,
        dest: cssDest
      };
    }
    else {
      ret[gruntCSS] = {
        src: pathjoin(p,"**/*.css"),
        dest: pathjoin(tmp,this.get('name'), "**/*.css")
      };
    }

    // now scripts
    if(this.get('combineScripts')){
      scriptsDest = pathjoin(tmp,this.get('name'), "**/*.js"); // but actually not with all folders :(
      ret[gruntConcat].js = {
        src: pathjoin(p,"**/*.js"),
        dest: scriptsDest
      };
    }
    else {
      scriptsDest = pathjoin(tmp,this.get('name'),"**/*.js");
    }


    return ret;
  }.property('path','gruntConcat','gruntStyleSheetProcessor',
      'combineStylesheets','combineScripts','minifyStylesheets','minifyScripts').cacheable()

});