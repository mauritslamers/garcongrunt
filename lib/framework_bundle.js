var SC = require('sc-runtime');
var Framework = require('./framework');
var tools = require('./tools');

module.exports = Framework.extend({

  isFrameworkBundle: true,

  gruntConfig: function(){
    // the gruntConfig of the frameworks is already separated out per plugin,
    // so we only need to add the content of this plugin to the general items
    var conf = {};
    this._frameworks.forEach(function(fw){
      tools.log('parsing fw ' + fw.get('name'));
      var gc = fw.get('gruntConfig');
      if(!gc) return;
      tools.log('fw config: ' + tools.inspect(gc));
      Object.keys(gc).forEach(function(plugin){
        var p = conf[plugin];
        if(!p) conf[plugin] = p = {};
        var fwname = tools.path.join(this.get('name'),fw.get('name')); // set config to sproutcore/ace
        p[fwname] = gc[plugin];
      },this);
    },this);
    return conf;
  }.property(),

  init: function(){
    var me = this;

    this._frameworks = this.frameworkNames.map(function(){
      return me._createFws.apply(me,arguments); // pass on to external function
    });
  },

  _createFws: function(fwname){
    var me = this, basePath = this.get('path'),
        path = tools.path.join(basePath,fwname);

    var fw = Framework.create({
      path: path,
      belongsTo: me.belongsTo,
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