import { readFile } from "fs/promises";

async function getFileContent({ path, opts }) {
  try {
    const raw = await readFile(path, { encoding: "utf8" });
    if (!opts) return raw;

    return { input: opts(raw) };
  } catch (error) {
    console.log(error.message);
  }
}

export default getFileContent;