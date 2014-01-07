
var grunt = require('grunt');
var path = require('path');
var node_modules_root = path.join(__dirname, "../node_modules");

grunt.loadNpmTasks('grunt-contrib-concat', node_modules_root);
grunt.loadNpmTasks('grunt-contrib-compass', node_modules_root);
grunt.loadNpmTasks('grunt-contrib-uglify', node_modules_root);

grunt.registerMultiTask('replace_static', 'find all static urls for images and replace it by a relative url in the project', function(){
  // go through the entire project and make a list of all files which are images in some way
  var target = this.target;
  //var data = this.data;
  //grunt.file.expand(this.target).forEach(function(f){
    //if()
  //});

  //the problem here is that we would like to have access to the other fws
  // we could try to do it through config
  // grunt.file.recurse(this.target,function(abspath,root,subdir,filename){

  // });

  // do two things: scan the contents, find sc_static references, replace the reference with an url
  // and copy the file to the target.
  // the syntax is for example:
  // 'filename.png' which can be either in resources/**/filename.png or in views/**/filename.png
  // 'images/png' which can be either resources/**/images/filename.png or in views /**/images/filename.png
  // 'fwname:filename.png' which can be either {dir_for_fwname}/resources/**/

/*
alternativeLocations: [
  '',
  'resources',
  'images',
  'english.lproj',
  'en.lproj'
],

gsub: function(source, re, callback, target) {
  var result = '',
      //source = this,
      match;

  target = target || this;
  while (source.length > 0) {
    if (match = re.exec(source)) {
      result += source.slice(0, match.index);
      result += callback.call(target,match);
      source  = source.slice(match.index + match[0].length);
    } else {
      result += source;
      source = '';
    }
  }

  return result;
},

matcher: function(match){
  var fw = this.file.get('framework');
  //var dirname = this.file.get('belongsTo').isSaving? fw.get('name'): fw.get('url');
  var dirname = fw.get('url');
  //tools.log("dirname for file " + this.file.get('path') + ": " + dirname);
  //tools.log('isSaving? ' + this.file.get('belongsTo').isSaving);
  //tools.log('gsub match in rewrite_static: ' + match);
  var path = tools.path.join(dirname,match[3]);
  var params = this.parameters || "'%@'";
  var ret;

  this.alternativeLocations.some(function(loc){
    var exts = [""].concat(this.file._resourceExtensions);
    return exts.some(function(extname){
      var alternatePath = tools.path.join(dirname, loc, match[3] + extname);
      //tools.log('garcon: trying to find alternative for ' + path + ' at ' +  alternatePath);
      //l.sys.log('garcon: dirname is ' + dirname);
      //l.sys.log('garcon: prefix is ' + prefix);
      //l.sys.log('garcon: name is ' + match[3] + extname);
      if (fw.server.files[alternatePath]) {
        //tools.log('found alternative path for ' + path + ": " + alternatePath);
        path = alternatePath;
        return true;
      } else {
        return false;
      }
    },this);
  },this);

  if (!this.file.getPath('framework.server').files[path]) {
    tools.util.puts('WARNING: ' + path + ' referenced in ' + this.file.get('path') + ' but was not found.');
  }

  //tools.log(this.file.getPath('framework.path') + ' urlPrefix in rewriteStatic is: ' + this.get('urlPrefix'));
  if(this.file.get('belongsTo').isSaving){
    var f = fw.server.files[path];
    if(f){
      // tools.log('replacing path with savePath: ' + f.get('savePath'));
      // tools.log('fw.dirname: ' + dirname);
      // tools.log('f.path: ' + f.get('path'));
      // tools.log('f.framework.nameFor: ' + f.framework.nameFor(f.path));
      // tools.log('f.framework.savePath: ' + f.framework.get('savePath'));
      // tools.log('f.framework.savePathFor: ' + f.framework.savePathFor(f.path));
      //tools.log('f.framework.');
      //path = f.get('savePath');
      //path = f.framework.savePathFor(f.path);
      path = f.get('url').substr(f.get('belongsTo').get('name').length+1);
    }
  }
  //tools.log('urlPrefix: ' + this.get('urlPrefix'));
  //tools.log('urlPrefix without get: ' + this.urlPrefix);
  //tools.log('path: ' + tools.inspect(path));
  ret = params.replace('%@', tools.path.join(this.get('urlPrefix') || '', path));
  //tools.log('returning rewritten staticurl: ' + ret);
  return ret;
},

finish: function(request,r,callback){
  //tools.util.log('rewriteStatic finish for ' + this.file.get('path'));
  var re = new RegExp("(sc_static|static_url)\\(\\s*['\"](resources\/){0,1}(.+?)['\"]\\s*\\)");

  //r.data = r.data.gsub(re,this.matcher,this);
  if(r.data){
    r.data = this.gsub(r.data,re,this.matcher,this);
  }
  callback(r);
}

*/

  var matcher = function(match){
    var fw = this.file.get('framework');
    //var dirname = this.file.get('belongsTo').isSaving? fw.get('name'): fw.get('url');
    var dirname = fw.get('url');
    //tools.log("dirname for file " + this.file.get('path') + ": " + dirname);
    //tools.log('isSaving? ' + this.file.get('belongsTo').isSaving);
    //tools.log('gsub match in rewrite_static: ' + match);
    var path = tools.path.join(dirname,match[3]);
    var params = this.parameters || "'%@'";
    var ret;

    this.alternativeLocations.some(function(loc){
      var exts = [""].concat(this.file._resourceExtensions);
      return exts.some(function(extname){
        var alternatePath = tools.path.join(dirname, loc, match[3] + extname);
        if (fw.server.files[alternatePath]) {
          //tools.log('found alternative path for ' + path + ": " + alternatePath);
          path = alternatePath;
          return true;
        } else {
          return false;
        }
      },this);
    },this);

    if (!this.file.getPath('framework.server').files[path]) {
      tools.util.puts('WARNING: ' + path + ' referenced in ' + this.file.get('path') + ' but was not found.');
    }

    //tools.log(this.file.getPath('framework.path') + ' urlPrefix in rewriteStatic is: ' + this.get('urlPrefix'));
    if(this.file.get('belongsTo').isSaving){
      var f = fw.server.files[path];
      if(f){
        // tools.log('replacing path with savePath: ' + f.get('savePath'));
        // tools.log('fw.dirname: ' + dirname);
        // tools.log('f.path: ' + f.get('path'));
        // tools.log('f.framework.nameFor: ' + f.framework.nameFor(f.path));
        // tools.log('f.framework.savePath: ' + f.framework.get('savePath'));
        // tools.log('f.framework.savePathFor: ' + f.framework.savePathFor(f.path));
        //tools.log('f.framework.');
        //path = f.get('savePath');
        //path = f.framework.savePathFor(f.path);
        path = f.get('url').substr(f.get('belongsTo').get('name').length+1);
      }
    }
    //tools.log('urlPrefix: ' + this.get('urlPrefix'));
    //tools.log('urlPrefix without get: ' + this.urlPrefix);
    //tools.log('path: ' + tools.inspect(path));
    ret = params.replace('%@', tools.path.join(this.get('urlPrefix') || '', path));
    //tools.log('returning rewritten staticurl: ' + ret);
    return ret;
  };


  var replace_static = function(filecontent){
    var re = new RegExp("(sc_static|static_url)\\(\\s*['\"](resources\/){0,1}(.+?)['\"]\\s*\\)");
    if(!filecontent){
      return filecontent;
    }
    else {

    }

  };



  // check every file for sc_static
  this.files.forEach(function(file){
    file.src.forEach(function(path){
      var c = grunt.file.read(path);


    });
  });
});


grunt.registerTask('processCss',['concat','compass']);

grunt.registerTask('startup',function(){
  //grunt.runTask('processCss');

});

grunt.registerTask('default',['startup']);

module.exports = grunt;