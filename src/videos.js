import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import hbjs from 'handbrake-js'
import _ from 'lodash'

const extractMeta = filepath =>
  ffprobe(filepath, { path: ffprobeStatic.path })
    .then(({ streams }) => _.pick(_.find(streams, ['codec_type', 'video']), ['width', 'height']))
    .catch(err => new Error(`Cannot get metadata for video ${filepath}`, err))

const encode = (filename, source, destination) =>
  hbjs
    .spawn({
      input: `${source}/${filename}`,
      output: `${destination}/${filename}`,
    })
    .on('error', err => new Error(`Cannot encode video ${filename}`, err))
    .on('progress', ({ percentComplete, eta }) => {
      console.log(`Percent complete: ${percentComplete}%, Estimated time arrival: ${eta}`)
    })

export {
  extractMeta,
  encode,
}
