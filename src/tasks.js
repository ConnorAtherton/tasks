var fs = require('fs');
var path = require("path");
var hw = require('headway');
var is = require('is');
var reporter = require('./reporters/pretty');

// TODO: ability to attach notes to a task
// TODO: enable carryon mode in .taskrc where
//       yesterdays tasks are carried forward to today
// TODO: Split task object away into it's own file
//       so we can just do tasks.list.. etc
// TODO: Created a new notes object. Comment above applies.
// TODO: Add generic methods in reporter. Error, notication, success.
// TODO clear the screen before printing any tasks/notes etc

function getTaskPath() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/tasks.json';
}

function readTaskFile() {
  var path = getTaskPath();

  try {
    return fs.readFileSync(path);
  } catch(e) {
    var start = JSON.stringify({});
    fs.writeFileSync(path, start);
    return fs.readFileSync(path);
  }
}

function getDate() {
  return (new Date()).toString().split(" ").slice(1, 4).join(" ");
}

function addAliases(cmds) {
  for (var cmd in cmds) {
    if (cmds.hasOwnProperty(cmd)) {
      var key = cmd[0];
      cmds[key] = cmds[cmd];
    }
  }

  // assign just commands
  return cmds;
}

function listTasks() {
  var tasks = JSON.parse(readTaskFile());
  var date = getDate();
  var taskString;

  if (!tasks[date]) return reporter.noTasks();

  taskString = tasks[date].reduce(function(taskTmpString, task, i) {
    var tmp = taskTmpString + reporter.taskNumber(i + 1, task);
    tmp = task.complete ? tmp + reporter.complete(task) : tmp + reporter.incomplete(task);
    return tmp;
  }, "\n\tHere are todays tasks\n");

  hw.log(taskString + '\n');
}

function addTask(task) {
  if (is.undef(task) || is.empty(task))
    return reporter.error("You can't add empty tasks");

  var tasks = JSON.parse(readTaskFile());
  var today = getDate();
  var path = getTaskPath();
  var taskObj = {
    title: task,
    complete: false
  };

  if (!Array.isArray(tasks[today]))
    tasks[today] = [];

  tasks[today].push(taskObj);

  fs.writeFile(path, JSON.stringify(tasks), function(err) {
    if (err) return reporter.error('Error writing tasks.json file');

    return listTasks();
  });
}

function deleteTask(taskId) {
  if (!is.number(taskId))
    return reporter.error("You need to pass a valid task number");

  var tasks = JSON.parse(readTaskFile());
  var today = getDate();
  var path = getTaskPath();

  if (!tasks[today] || tasks[today].length < taskId)
    return reporter.invalidTask(taskId);

  tasks[today].splice(taskId - 1, 1);

  fs.writeFile(path, JSON.stringify(tasks), function(err) {
    if (err) return reporter.error('Error writing tasks.json file');

    return listTasks();
  });
}

function changeTaskStatus(taskId, key, status) {
  if (!is.number(taskId))
    return reporter.error("You need to pass a valid task number");

  var tasks = JSON.parse(readTaskFile());
  var today = getDate();
  var path = getTaskPath();

  if (!tasks[today] || tasks[today].length < taskId)
    return reporter.invalidTask(taskId);

  tasks[today][taskId - 1][key] = status;

  fs.writeFile(path, JSON.stringify(tasks), function(err) {
    if (err) return reporter.error('Error writing tasks.json file');

    listTasks();

    var todo = tasks[today].filter(function(task) {
      if (!task.complete || !task.deleted) return task;
    });

   if (todo.length === 0) reporter.tasksComplete();
  });
}

function listDoc() {
  var doc = fs.readFileSync(path.resolve(__dirname, '..', 'doc/help.txt'));
  hw.log(doc.toString());
}

module.exports = function(argv) {
  var cmds = {
    add: [addTask, []],
    "delete": [deleteTask, []],
    complete: [changeTaskStatus, ["complete", true]],
    uncomplete: [changeTaskStatus, ["complete", false]],
    list: [listTasks],
    help: [listDoc]
  };

  cmds = addAliases(cmds);

  var args = argv._.slice(1);
  var cmd = argv._[0];

  if (!!cmds[cmd]) {
    var action = cmds[cmd];

    if (action.length > 1) {
      action[1] = args.concat(action[1]);
    }

    action[0].apply(this, action[1]);
  } else {
    cmds.list[0]();
  }
};
