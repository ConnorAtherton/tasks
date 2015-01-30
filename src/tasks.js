var fs = require('fs');
var path = require("path");
var hw = require('headway');

/**
 *
 *
 *
 */
function getTaskPath() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/tasks.json';
}

/**
 *
 *
 *
 */
function readTaskFile() {
  var path = getTaskPath();

  if (!fs.exists(path)) {
    // we need to create it..
    var start = JSON.stringify({});
    fs.writeFileSync(path, start);
  }

  return fs.readFileSync(path);
}

function addTask(task) {
  var taskObj = {
    title: task,
    completed: false
  }

  var tasks = readTaskFile();
  console.log(tasks);
}

function getDate() {
  return (new Date()).toString().split(" ").slice(1, 4).join(" ");
}

function addAliases(argv) {
  var newArgv;
  var aliases = {
    "add": "a",
    "complete": "c"
  }

  // assign just commands
  return argv;
}

function listTasks() {
  var tasks = JSON.parse(readTaskFile());
  var date = getDate();
  var taskString;

  console.log(tasks);
  if (!tasks[date]) return hw.log("#{yellow} No tasks set up for today");

  var taskString = tasks[date].reduce(function(tasks, task, i) {
    var tmp = tasks + "\t{green}" + i + "){/}  {yellow}"
    tmp = task.complete ? tmp + task.title + "{green} (COMPLETE)": tmp + task.title;
  }, "");

  hw.log(taskString);
}

function addTask(task) {
  var tasks = JSON.parse(readTaskFile());
  var today = getDate();
  var path = getTaskPath();
  var taskObj = {
    title: task,
    complete: false
  }

  if (!Array.isArray(tasks[today])) {
    tasks[today] = [];
  }

  tasks[today].push(taskObj);
  console.log(tasks, path);
  fs.writeFileSync(path, "re");
  // fs.writeFileSync(path, JSON.stringify(tasks));

  hw.log('{yellow} Task added.');
  return listTasks();
}

function deleteTask(taskId) {

}

module.exports = function(argv) {
  argv = addAliases(argv);
  console.log(argv, listTasks());
  if (argv.add) return addTask(argv.add);
  if (argv.complete) return completeTask(argv.c);
}
