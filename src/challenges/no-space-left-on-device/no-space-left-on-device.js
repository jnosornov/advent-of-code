import chalk from "chalk"
import numeral from "numeral"

import { run } from "../../helpers/general.js"
import { getFileContent } from "../../helpers/file.js"
import Tree from "../../structures/tree/tree.js"
import Stack from "../../structures/stack/stack.js"

import { LINE_JUMP, EMPTY_STRING } from "../../constants.js"

class FsTree extends Tree {
  prettify() {
    let tree = ""

    if (!this.root) {
      throw new Error("the tree is empty")
    }

    const getIdentation = (times) => {
      const EMPTY_SPACE = " "
      return EMPTY_SPACE.repeat(times)
    }

    const prettyPrintTree = ({ node = this.root, identation = 0 }) => {
      const isRootDirectory = node.key === this.root.key
      const prefix = `${tree}${getIdentation(identation)}${isRootDirectory ? LINE_JUMP : ""}`
      const dirsize = `${chalk.magenta(numeral(node.value.size).format("0,0"))}${LINE_JUMP}`

      const directory = `${isRootDirectory ? dirsize : `• ${node.key} ${dirsize}`}`
      const files = node.value.files.reduce((accum, file) => {
        const { name, size } = file
        const prefix = `${accum}${isRootDirectory ? getIdentation(identation) : getIdentation(identation + 2)}`
        return `${prefix}${name} ${chalk.yellow(numeral(size).format("0,0"))}${LINE_JUMP}`
      }, EMPTY_STRING)

      tree = `${prefix}${directory}${files}`

      for (let i = 0; i < node.children.length; i++) {
        prettyPrintTree({ node: node.children[i], identation: isRootDirectory ? 0 : identation + 2 })
      }

      return tree
    }

    return console.log(`${prettyPrintTree({ node: this.root, identation: 0 })}`)
  }
}

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
  let currentDirectory = { parentId: null, directories: [], files: [], size: 0 }

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
        const size = parseInt(terminalOutput[i].match(/[0-9]+/)[0])
        const name = terminalOutput[i].match(/[.a-z]+/)[0]
        // console.log(currentDirectory)
        // currentDirectory.size = currentDirectory.size + size
        currentDirectory.files.push({ name, size })
      }
    }

    if (isChangeDirectoryCommand(terminalOutput[i])) {
      const directory = terminalOutput[i].match(/(?<=\$ cd )([/.a-z]+)/)[0]

      if (directory === "/") {
        if (!route) {
          filesystemTree = new FsTree()
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
      console.log(currentDirectory)
      const { parentId, directories, files, size } = currentDirectory

      const parent = filesystemTree.find(parentId)
      parent.setValue({ size, files })

      for (let i = 0; i < directories.length; i++) {
        filesystemTree.add({ key: directories[i], parent })
      }

      isListingDirectoryItems = false
      currentDirectory = { parentId: null, directories: [], files: [], size: 0 }
    }
  }

  filesystemTree.prettify()
}

run(() => init({ fruit: "1" }))
