import { readFile, readdir } from "node:fs/promises"

async function getFileContent({ path, opts }) {
  try {
    const raw = await readFile(path, { encoding: "utf8" })

    if (!raw.length) {
      throw Error("input file has no data")
    }

    if (!opts) return raw
    return { input: opts(raw) }
  } catch (error) {
    console.log("did not found the folder")
    console.log(error)
    process.exit()
  }
}

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export {
  getDirectories,
  getFileContent
}
