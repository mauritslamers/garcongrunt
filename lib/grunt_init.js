
var grunt = require('grunt');
var path = require('path');
var node_modules_root = path.join(__dirname, "../node_modules");

grunt.loadNpmTasks('grunt-contrib-concat', node_modules_root);
grunt.loadNpmTasks('grunt-contrib-compass', node_modules_root);
grunt.loadNpmTasks('grunt-contrib-uglify', node_modules_root);

var imageFiles = [];

grunt.registerMultiTask('findImages', 'find all images in the project', function(){
  // go through the entire project and make a list of all files which are images in some way
  var target = this.target;
  //var data = this.data;
  //grunt.file.expand(this.target).forEach(function(f){
    //if()
  //});
  grunt.file.recurse(this.target,function(abspath,root,subdir,filename){

  });
});

grunt.registerTask('replace_static',function(){

});

grunt.registerTask('processCss',['concat','compass']);

grunt.registerTask('startup',function(){
  grunt.runTask('processCss');
});

grunt.registerTask('default',['startup']);

module.exports = grunt;