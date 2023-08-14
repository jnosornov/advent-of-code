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

  let filesystemTree
  let directories
  let isListingDirectoryItems = false
  let currentFolderItems = { directories: [], files: [] }

  for (let i = 0; i < terminalOutput.length; i++) {
    const isChangeDirectoryCommand = (command) => /^\$ cd/.test(command)
    const isListCommand = (command) => /\$ ls/.test(command)

    if (isListCommand(terminalOutput[i])) {
      isListingDirectoryItems = true
    }

    if (isListingDirectoryItems) {
      const isDirectory = /dir [a-z]+/.test(terminalOutput[i])
      const isFile = /[0-9]+ [.a-z]+/.test(terminalOutput[i])

      if (isDirectory) {
        const directory = terminalOutput[i].match(/(?<=dir )([a-z]+)/)[0]
        currentFolderItems.directories.push(directory)
      }

      if (isFile) {
        const size = terminalOutput[i].match(/[0-9]+/)[0]
        const name = terminalOutput[i].match(/[.a-z]+/)[0]

        currentFolderItems.files.push({ name, size })
      }
    }

    if (isChangeDirectoryCommand(terminalOutput[i])) {
      const directory = terminalOutput[i].match(/(?<=\$ cd )([/.a-z]+)/)[0]

      if (directory === "/") {
        if (!directories) {
          filesystemTree = new Tree()
          filesystemTree.add({ key: "/" })
        }

        directories = new Stack()
      }

      if (directory === "..") {
        directories.pop()
      } else {
        directories.push(directory)
      }
    }

    if (isListingDirectoryItems && (!terminalOutput[i + 1] || isChangeDirectoryCommand(terminalOutput[i + 1]))) {
      // add tree node with directories nodes and files as value

      isListingDirectoryItems = false
      currentFolderItems = { directories: [], files: [] }
    }
  }
}

run(() => init({ fruit: "1" }))
