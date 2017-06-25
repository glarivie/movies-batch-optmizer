import 'babel-polyfill'
import 'dotenv/config'

require('./commander').parse()

process.on('uncaughtException', error => {
  throw new Error(error, 'Uncaught exception');
})
