const path = require('path')
const fsPromises = require('fs/promises')
const logger = require('../utils/logger')

async function getFileMetadata({ year, exerciseId }) {
  const filepath = path.join(process.cwd(), `${year}/${exerciseId}`, 'input.txt')
  try {
    const metadata = await fsPromises.readFile(filepath, 'utf-8')
    return metadata
  } catch (error) {
    logger.log('Could not read the file', error)
    process.exit()
  }
}

module.exports.getFileMetadata = getFileMetadata