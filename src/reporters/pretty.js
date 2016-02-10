var hw = require('headway')

module.exports = {
  intro: function() {
    return '{yellow}Here are your tasks for today\n'
  },

  tasksComplete: function() {
    return 'All tasks complete. {_cyan_}{red}{_underline}Yay\n'
  },

  error: function(msg) {
    hw.log(`{red}${msg}`)
  },

  noTasks: function() {
    return '{yellow}No tasks set up for today'
  },

  taskNumber: function(number) {
    return `\n{green}[${number}] {/}`
  },

  complete: function(task) {
    return `{green}✓{/} {light_black}${task.title}`
  },

  incomplete: function(task) {
    return `{red}✖{/} ${task.title}`
  }
}

