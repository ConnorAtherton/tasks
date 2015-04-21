module.exports = {
  tasksComplete: function() {
    hw.log('\tAll tasks complete. Yay\n');
  },

  error: function(msg) {
    hw.log(msg);
  },

  noTasks: function() {
    hw.log("No tasks set up for today");
  },


  /**
   * These don't print anything, they just retrn a formatted string for
   * when all tasks are printed at once.
   *
   */

  taskNumber: function(number, task) {
    return "\n\t[" + number + "] ";
  },

  complete: function(task) {
    return task.title;
  },

  incomplete: function(task) {
    return task.title;
  }
};

