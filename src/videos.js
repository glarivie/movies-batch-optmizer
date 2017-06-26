import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import hbjs from 'handbrake-js'
import ProgressBar from 'ascii-progress'
import _ from 'lodash'
import { log } from 'console'
import fs from 'fs-extra'

import { getFileSize, removeFile } from './files'

const extractMeta = filepath =>
  ffprobe(filepath, { path: ffprobeStatic.path })
    .then(({ streams }) => _.pick(_.find(streams, ['codec_type', 'video']), ['width', 'height']))
    .catch(err => new Error(`Cannot get metadata for video ${filepath}`, err))

const encode = ({ filename, size }, { source, destination, preset }, progress) => {
  const name = `${filename.split('.').slice(0, -1).join('.')}_optimized.mp4`
  const input = `${source}/${filename}`
  const output = `${destination}/${name}`
  const bar = new ProgressBar({
    schema: `[${progress}] ${filename} [:bar] :completed % :time`,
    total: 100,
  })

  hbjs
    .spawn({ input, output, preset })
    .on('error', err => new Error(`Cannot encode video ${filename}`, err))
    .on('begin', () => bar.tick({ completed: 0, time: '' }))
    .on('progress', ({ percentComplete, eta }) => {
      if (parseInt(percentComplete, 10) > bar.curr)
        bar.tick({ completed: parseInt(percentComplete, 10), time: eta })
    })
    .on('end', async () => {
      const outputSize = await getFileSize(output)

      if (outputSize < size) {
        await removeFile(input)

        fs.move(output, `${source}/${name}_optimized.mp4`)
          .then(() => log(`${filename} successfully converted: ${size - outputSize} Mb earn !`))
          .catch(err => new Error(`Cannot move file ${name}_optimized.mp4`, err))
      }
    })
}

export {
  extractMeta,
  encode,
}
