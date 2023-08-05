import mockFs from "mock-fs"
import { equal, deepEqual } from "assert"
import { getFileContent } from "./file.js"
import { EMPTY_SPACE } from "../constants.js"

describe("getFileContent", () => {
  beforeEach(() => {
    mockFs({
      files: {
        "empty-file.txt": "",
        "hello-world.txt": "hello world"
      }
    })
  })

  afterEach(mockFs.restore)

  it("should throw an error when the file is empty", async () => {
    try {
      await getFileContent({ path: `${process.cwd()}/files/empty-file.txt` })
    } catch (e) {
      equal(e.message, "file is empty")
    }
  })

  it("should return file content", async () => {
    const { contents } = await getFileContent({ path: `${process.cwd()}/files/hello-world.txt` })
    equal(contents, "hello world")
  })

  it("should return file content when an operation is perform", async () => {
    const { contents } = await getFileContent({
      path: `${process.cwd()}/files/hello-world.txt`,
      opts: (entry) => entry.split(EMPTY_SPACE)
    })

    deepEqual(contents, ["hello", "world"])
  })
})
