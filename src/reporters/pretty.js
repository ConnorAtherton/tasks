var hw = require('headway');

module.exports = {
  tasksComplete: function() {
    hw.log('\tAll tasks complete. {_cyan_}{red}{_underline}Yay\n');
  },

  error: function(msg) {
    hw.log("{red}" + msg);
  },

  noTasks: function() {
    hw.log("{yellow} No tasks set up for today");
  },


  /**
   * These don't print anything, they just retrn a formatted string for
   * when all tasks are printed at once.
   *
   */

  taskNumber: function(number, task) {
    return "\n\t{green}[" + number + "]{/} ";
  },

  complete: function(task) {
    return "{green}✓{/} " + task.title;
  },

  incomplete: function(task) {
    return "{red}✖{/} " + task.title;
  }
}

