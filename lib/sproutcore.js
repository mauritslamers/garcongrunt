var SC = require('sc-runtime');
var FrameworkBundle = require('./framework_bundle');
var Framework = require('./framework');
var tools = require('./tools');

module.exports = FrameworkBundle.extend({

  name: 'sproutcore',
  path: 'frameworks/sproutcore/',
  isSC: true, // identifier for the building process, to store sproutcore in a separate file
  customSC: false, // flag to denote that this SC is not shared, but separate, causes prepending of app name
  combineScripts: true,
  nodifyScripts: true,
  watchForChanges: false,
  frameworkNames: null,
  defaultVersion: "1.9.1",
  pathsToExclude: null,

  defaultFrameworkNames: [
    'frameworks/bootstrap',
    'frameworks/jquery',
    'frameworks/runtime',
    'frameworks/core_foundation',
    'frameworks/template_view',
    'frameworks/datetime',
    'frameworks/foundation',
    'frameworks/routing',
    'frameworks/statechart',
    'frameworks/datastore',
    'frameworks/ajax',
    'frameworks/desktop'
  ],

  internalSproutcoreDirectory: function(){
    var version = this.get('version') || this.get('defaultVersion');
    return tools.path.join(tools.lib_dir,"sproutcore",version);
  }.property('version').cacheable(),

  init: function(){
    // depending on version we make a different selection of frameworks
    var v = this.version? this.version.split("."): this.get('defaultVersion').split(".");
    var isOldSC = parseInt(v[1],10) <= 4; // under 1.5.0
    if(!this.combineScripts){
      tools.log('WARNING: Sproutcore has combineScripts set to false. Be aware of side effects, the Test Application will not be able to run.');
    }
    if(!this.frameworkNames){
      if(isOldSC){
        this.frameworkNames = "bootstrap jquery runtime foundation datastore desktop animation testing".split(" ")
                              .map(function(fn){ return "frameworks/" + fn; });
      }
      else this.frameworkNames = this.defaultFrameworkNames;
    }

    if(this.theme === 'sc-theme' || this.theme === 'ace' || this.theme === 'iphone'){
      if(this.theme === "sc-theme"){
        if(isOldSC) this.frameworkNames.push("themes/empty_theme","themes/standard_theme");
        else this.frameworkNames.push("themes/empty_theme","themes/legacy_theme");
      }
      if(this.theme === 'ace'){
        this.frameworkNames.push("themes/empty_theme","themes/ace");
      }
      if(this.theme === 'iphone'){
        this.frameworkNames.push('themes/empty_theme','themes/iphone_theme');
      }
      if(parseInt(v[1],10) >= 5){ // above 1.5.0)
        this.frameworkNames.push('frameworks/yuireset');
      }
    }

    //tools.log('garconlibdir: ' + tools.lib_dir);
    if(!this.pathsToExclude){
      this.pathsToExclude = [/fixtures\//];
    }
    else {
      if(SC.typeOf(this.pathsToExclude) === 'array'){
        this.pathsToExclude.push(new RegExp(/fixtures\//));
      }
      else if(SC.typeOf(this.pathsToExclude) === 'regexp'){
        this.pathsToExclude = [this.pathsToExclude];
      }
    }
    arguments.callee.base.apply(this,arguments);
  },

  _createFws: function(fwname){
    var me = this, basePath = this.get('path'),
        path = tools.path.join(basePath,fwname);

    var fw = Framework.create({
      path: path,
      belongsTo: me.customSC? me.belongsTo: null,
      watchForChanges: me.watchForChanges,
      minifyScripts: me.minifyScripts,
      combineOnSave: me.combineOnSave,
      combineScripts: me.combineScripts,
      minifyOnSave: me.minifyOnSave,
      stylesheetProcessor: me.stylesheetProcessor,
      pathsToExclude: [/fixtures\//]
    });
    // fw.build();
    return fw;
  }

});