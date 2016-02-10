var hw = require('headway')

module.exports = {
  intro: function() {
    return hw.log('Here are your tasks for today')
  },

  tasksComplete: function() {
    return hw.log('All tasks complete. Yay')
  },

  error: function(msg) {
    return hw.log(msg)
  },

  noTasks: function() {
    return hw.log('No tasks set up for today')
  },

  taskNumber: function(number) {
    return `\n[${number}] `
  },

  complete: function(task) {
    return `${task.title} (complete)`
  },

  incomplete: function(task) {
    return `${task.title} (incomplete)`
  }
}

