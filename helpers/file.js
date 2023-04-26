import { readFile } from "fs/promises";

async function getFileContent({ path }) {
  try {
    return await readFile(path, { encoding: "utf8" });
  } catch (error) {
    console.log(error.message);
  }
}

export default getFileContent;