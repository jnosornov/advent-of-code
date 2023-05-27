const { readFile, readdir } = require("fs/promises");

async function getFileContent({ path, opts }) {
  try {
    const raw = await readFile(path, { encoding: "utf8" });

    if (!raw.length) {
      throw Error("input file has no data");
    }

    if (!opts) return raw;
    return { input: opts(raw) };
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

module.exports = {
  getDirectories,
  getFileContent,
}