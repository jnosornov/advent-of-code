import chalk from "chalk"
import numeral from "numeral"

const LINE_JUMP = "\n"
const EMPTY_STRING = ""

class Node {
  constructor({ key, value = null, parent = null }) {
    this.key = key
    this.value = value
    this.parent = parent
    this.children = []
  }

  setValue(value) {
    this.value = value
  }
}

class Tree {
  constructor() {
    this.root = null
  }

  add({ key, value, parentId }) {
    const node = new Node({ key, value, parentId })

    if (!this.root) {
      this.root = node
      return
    }

    const parent = this.find(parentId)
    if (!parent) {
      throw new Error(`node with given key ${parentId} has not been found`)
    }

    node.parent = parent
    parent.children.push(node)
  }

  find(key) {
    if (!this.root) {
      throw new Error("the tree is empty")
    }

    if (key === this.root.key) {
      return this.root
    } else {
      return this.dfs({ key, node: this.root })
    }
  }

  dfs({ key, node }) {
    let target = null

    if (!this.root) {
      throw new Error("the tree is empty")
    }

    recursiveDepthTraverse(node)
    return target

    function recursiveDepthTraverse(currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        if (currentNode.children[i].key === key) {
          target = currentNode.children[i]
          break
        }

        recursiveDepthTraverse(currentNode.children[i])
        if (target) break
      }
    }
  }

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
      const dirsize = `${chalk.magenta(node.size || "null")}${LINE_JUMP}`

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

export default Tree
