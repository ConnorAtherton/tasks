var fs = require('fs');
var path = require("path");
var hw = require('headway');

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

  if (!tasks[date]) return hw.log("#{yellow} No tasks set up for today");

  var taskString = tasks[date].reduce(function(tasks, task, i) {
    var tmp = tasks + "\n\t{green}[" + (i + 1) + "]{/} ";
    tmp = task.complete ? tmp + "{green}✓{/} " + task.title : tmp + "{red}✖{/} " + task.title;
    return tmp;
  }, "\n\tHere are todays tasks\n");

  hw.log(taskString + '\n');
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
  fs.writeFile(path, JSON.stringify(tasks), function(err) {
    if (err) return hw.log("{red}Error writing task file");

    // hw.log('# {yellow} Task added.\n');
    return listTasks();
  });
}

function changeTaskStatus(taskId, status) {
  var tasks = JSON.parse(readTaskFile());
  var today = getDate();
  var path = getTaskPath();

  if (!tasks[today] || tasks[today].length < taskId)
    return hw.log('# {red}Invalid task id');

  tasks[today][taskId - 1].complete = status;
  fs.writeFile(path, JSON.stringify(tasks), function(err) {
    listTasks();

    var todo = tasks[today].filter(function(task) {
      if (!task.complete) return task;
    });

   if (todo.length === 0) hw.log('\tAll tasks complete. {_cyan_}{red}{_underline}Yay\n');
  });
}

function listDoc() {
  var doc = fs.readFileSync(path.resolve(__dirname, '..', 'doc/help.txt'));
      hw.log(doc.toString());
}

module.exports = function(argv) {
  var cmds = {
    add: [addTask, []],
    complete: [changeTaskStatus, [true]],
    uncomplete: [changeTaskStatus, [false]],
    list: [listTasks],
    help: [listDoc]
  }
  cmds = addAliases(cmds);

  var args = argv._.slice(1);
  var cmd = argv._[0];

  if (!!cmds[cmd]) {
    if (cmds[cmd].length > 1) {
      cmds[cmd][1].unshift(args);
    }

    cmds[cmd][0].apply(this, cmds[cmd][1]);
  } else {
    cmds.list[0]();
  }
}
