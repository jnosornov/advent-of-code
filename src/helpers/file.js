import { readFile, readdir } from "node:fs/promises"

async function getFileContent({ base, opts }) {
  const filename = process.env.NODE_ENV === "test" ? "./input.sample.txt" : "./input.txt"
  const path = new URL(filename, base)

  try {
    const raw = await readFile(path, { encoding: "utf8" })
    if (!raw.length) {
      throw Error("input file has no data")
    }

    if (!opts) return { contents: raw }
    return { contents: opts(raw) }
  } catch (error) {
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
