var SC = require('sc-runtime');
var Framework = require('./framework');
var FrameworkBundle = require('./framework_bundle');
var tools = require('./tools');
var SproutCore = require('./sproutcore');

// module App
module.exports = SC.Object.extend({

  name: null,
  theme: 'ace',
  htmlBody: null,
  htmlHead: null,
  hasSC: true,
  configSC: null, // do not create instances here...
  frameworks: null,
  // frameworks: [
  //   //{ path: 'getting-started/apps/todos_one'}
  // ],

  hasBuilt: false,

  _frameworks: null, // internal frameworks instances array

  gruntConfig: function(){
    // the gruntConfig of the frameworks is already separated out per plugin,
    // so we only need to add the content of this plugin to the general items
    var me = this;
    var conf = {};
    this._frameworks.forEach(function(fw){
      var gc = fw.get('gruntConfig');
      if(!gc) return;
      Object.keys(gc).forEach(function(plugin){
        var frameworkName = fw.get('name');
        var p = conf[plugin];
        if(!p) conf[plugin] = p = {};
        if(fw.isFrameworkBundle){
          //tools.log('instanceof FrameworkBundle');
          Object.keys(gc[plugin]).forEach(function(fwname){
            var lemma = tools.path.join(this.get('name'),fwname);
            p[lemma] = gc[plugin][fwname];
          },me);
        }
        else {
          var lemma = tools.path.join(this.get('name'),frameworkName);
          p[lemma] = gc[plugin];
        }
      },me);
    },me);
    return conf;
  }.property(),

  // where the source of the current framework is located
  srcPath: function(){
    var fws = this._frameworks;
    return fws.getEach('basePath').flatten();
  }.property(),

  // where to store the temporary files for staging / processing
  tmpPath: function(){

  },

  // where to store the files for development server
  destPath: function(){

  },

  // a collection of all source paths for this app, including frameworks this app depends on
  basePaths: function(){
    return this._frameworks.getEach('basePath').reduce(function(prev,next){
      if(!prev) return next;
      else {
        return SC.mixin(prev,next);
      }
    });
  }.property(),

  path: function(){
    var n = this.get('name');
    return tools.path.join("apps",n);
  }.property('name').cacheable(),

  build: function(cb){
    // make an overview of the project and create a grunt file
    var fws = this.get('frameworks');
    var ownPath = this.get('path');
    var scConfig = this.get('configSC') || {};

    if(fws.indexOf(ownPath) === -1) fws.push({ path: ownPath });
    if(!this._frameworks) this._frameworks = [];
    if(this.hasSC){
      scConfig.belongsTo = this;
      this._frameworks.push(SproutCore.create(scConfig));
    }
    fws.forEach(function(fw){
      fw.belongsTo = this;
      var f = Framework.create(fw);
      //f.build();
      this._frameworks.push(f);
    },this);
    this.set('isBuilt',true);
    //cb();
  }


});