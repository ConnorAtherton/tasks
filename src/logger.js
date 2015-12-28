export default class Logger {
  use(reporter) {
    this.reporter = reporter
  }

  write(string) {
    this.reporter.write(string)
  }

  start() {
    this.reporter.start()
  }

  finish() {
    this.reporter.finish()
  }

  exit(code) {
    // flush streams
    process.stdout.write('')
    process.stderr.write('')
    process.exit(code)
  }
}
