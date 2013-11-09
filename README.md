A retrial from scratch...

There is just too much in garcon atm which creates problems.
So, a simple front end which can simply detect what is necessary for grunt

For this to work a small adjustment needs to be made to grunt:
node_modules/grunt/lib/grunt/task.js

line 367-369 need to become:

task.loadNpmTasks = function(name,root) {
  loadTasksMessage('"' + name + '" local Npm module');
  root = root || path.resolve('node_modules');