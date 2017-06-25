import program from 'commander'
import { env, argv } from 'process'

import { readDirectory, getFileSize } from './files'
import { extractMeta, encode } from './videos'

program
  .version('0.1.0')
  .usage('npm start -- <...args>')
  .option('-s, --source [pathname]', 'source directory')
  .option('-d, --destination [pathname]', 'destination directory', '/tmp')
  .option('-m, --max [size]', 'Files with a superior size (in Mb) will be processed', env.DEFAULT_MAX_SIZE)
  .option('-p, --preset [preset]', 'Handbrake preset: Normal or High Profile', env.DEFAULT_PRESET)
  .parse(argv)

if (!program.source)
  throw new Error('The program need a source directory')

const parse = async () => {
  // Get all filename in a directory
  const files = await readDirectory(program.source)

  // Get files metadatas
  const data = await Promise.all(files.map(async filename => {
    const path = `${program.source}/${filename}`
    const { width, height } = await extractMeta(path)
    const size = await getFileSize(path)

    return { filename, size, width, height }
  }))

  const batch = data
    .filter(({ size }) => size > parseInt(program.max, 10))
    .sort((a, b) => a.size - b.size)

  batch.forEach((video, index) => encode(video, program, `${index + 1} / ${batch.length}`))
}

export {
  parse,
}
