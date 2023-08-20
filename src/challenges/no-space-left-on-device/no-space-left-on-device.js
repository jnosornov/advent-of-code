import { run, logFruits, collectFruits } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import Tree from "../../structures/tree/tree.js"
import Stack from "../../structures/stack/stack.js"

export default async function init({ fruit }) {
  const filename = process.env.NODE_ENV !== "test"
    ? "./input.sample.txt"
    : "./input.txt"

  const { contents: terminalOutput } = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => entry.split(/\r?\n/)
  })

  let route
  let filesystemTree
  let isListingDirectoryItems = false
  let currentDirectory = { parentId: null, directories: [], files: [], size: null }

  for (let i = 0; i < terminalOutput.length; i++) {
    const isChangeDirectoryCommand = (command) => /^\$ cd/.test(command)
    const isListCommand = (command) => /\$ ls/.test(command)

    if (isListCommand(terminalOutput[i])) {
      isListingDirectoryItems = true
    }

    if (isListingDirectoryItems) {
      const isDirectory = /dir [a-z]+/.test(terminalOutput[i])
      const isFile = /[0-9]+ [.a-z]+/.test(terminalOutput[i])

      currentDirectory.parentId = route.peek()

      if (isDirectory) {
        const directory = terminalOutput[i].match(/(?<=dir )([a-z]+)/)[0]
        currentDirectory.directories.push(directory)
      }

      if (isFile) {
        const size = terminalOutput[i].match(/[0-9]+/)[0]
        const name = terminalOutput[i].match(/[.a-z]+/)[0]
        currentDirectory.files.push({ name, size })
      }
    }

    if (isChangeDirectoryCommand(terminalOutput[i])) {
      const directory = terminalOutput[i].match(/(?<=\$ cd )([/.a-z]+)/)[0]

      if (directory === "/") {
        if (!route) {
          filesystemTree = new Tree()
          filesystemTree.add({ key: "/" })
        }

        route = new Stack()
      }

      if (directory === "..") {
        route.pop()
      } else {
        route.push(directory)
      }
    }

    if (isListingDirectoryItems && (!terminalOutput[i + 1] || isChangeDirectoryCommand(terminalOutput[i + 1]))) {
      const { parentId, directories, files, size } = currentDirectory

      const node = filesystemTree.find(parentId)
      node.setValue({ size, files })
      for (let i = 0; i < directories.length; i++) {
        filesystemTree.add({ key: directories[i], parentId })
      }

      isListingDirectoryItems = false
      currentDirectory = { directories: [], files: [], size: null }
    }
  }

  filesystemTree.prettify()
}

run(() => init({ fruit: "1" }))
