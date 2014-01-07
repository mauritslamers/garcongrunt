var SC = require('sc-runtime');
var tools = require('./tools');
var App = require('./app');
var grunt = require('./grunt_init');

module.exports = SC.Object.extend({

  addApp: function(app){
    var me = this;
    if(!app){
      tools.log("WARNING: Server#addApp: app is " + app);
      return;
    }
    if(!SC.instanceOf(App,app)){
      app = App.create(app);
    }
    if(!this.apps){
      this.apps = [];
      this.appCount = 0;
    }

    if(!app.doneBuilding){  // only start building when app hasn't been built and isn't already building.
      if(!app.isBuilding){
        this.appCount += 1;
        //tools.log('app is not yet built, so start building...');
        tools.log("Building app: " + app.get('name'));
        app.addObserver('isBuilt',this,'appHasBuilt');
        app.build();
        // app.build(function(){
        //   me.apps.push(app);
        //   // //me._targets = me._targets.concat(app.get('targets'));
        //   // process.nextTick(function(){
        //   //   me.triggerGrunt();
        //   // });
        // });
      }
    }
    else this.apps.push(app); // otherwise just add, things will be added automatically
    return app;
  },

  appHasBuilt: function(app){
    app.removeObserver('isBuilt',this,'appHasBuilt');
    this.apps.push(app);
    this.invokeLast('triggerGrunt'); // defer till later
  },

  triggerGrunt: function(){
    if(this.appCount === this.apps.length){
      tools.log('ready building!');
      // now we need to retrieve the config
      // and add some plugins, for now hard coded...
      var config = {
        basePaths: {}
      };
      debugger;
      this.apps.forEach(function(app){
        var c = app.get('gruntConfig');
        var appPath = app.get('path');
        config.basePaths[app.get('name')] = app.get('basePaths');
        Object.keys(c).forEach(function(p){
          if(!config[p]) config[p] = {};
          Object.keys(c[p]).forEach(function(fw){
            config[p][fw] = c[p][fw];
          });
        });
      });
      tools.log('end-config: ' + tools.inspect(config));

      //tools.log('starting grunt');
      //grunt.initConfig(config);

      //debugger;
      //grunt.task.run('processCss');
      //grunt.task.start();
    }
  },

  run: function(cb){
    this._cb = cb;
  }

});