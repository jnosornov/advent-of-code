import { readFile, readdir } from "node:fs/promises"

async function getFileContent({ path, opts = null }) {
  try {
    const raw = await readFile(path, { encoding: "utf8" })
    if (!raw.length) {
      throw Error("file is empty")
    }

    if (!opts) return { contents: raw }
    return { contents: opts(raw) }
  } catch (error) {
    console.log(error)

    // be able to catch exception in test
    if (process.env.NODE_ENV === "test") {
      throw (error)
    }
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
