import util from 'util'
import fs from 'fs'
import convert from 'convert-units'
import { env } from 'process'

const types = env.FILES_TYPES.split(',')

const readDirectory = path =>
  util.promisify(fs.readdir)(path)
    .then(files => files.filter(f => types.includes(f.split('.').slice(-1)[0])))
    .catch(err => new Error(`Cannot read the directory content of ${path}`, err))

const getFileSize = path =>
  util.promisify(fs.stat)(path)
    .then(({ size }) => convert(size).from('b').to('Mb'))
    .catch(err => new Error(`Cannot get filesize for ${path}`, err))

const removeFile = path =>
  util.promisify(fs.unlink)(path)
    .catch(err => new Error(`Cannot delete file ${path}`, err))

export {
  readDirectory,
  getFileSize,
  removeFile,
}
