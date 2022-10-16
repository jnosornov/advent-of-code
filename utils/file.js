const path = require('path')
const fsPromises = require('fs/promises')
const logger = require('../utils/logger')

async function getFileMetadata({ year, exerciseId }) {
  const filepath = path.join(process.cwd(), 'input.txt')
  try {
    const metadata = await fsPromises.readFile(filepath, 'utf-8')
    throw Error('error')
    return metadata
  } catch (error) {
    logger.log('could not read the file', error)
  }
}

module.exports.getFileMetadata = getFileMetadata