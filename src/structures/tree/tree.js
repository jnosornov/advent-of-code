const LINE_JUMP = "\n"

class Node {
  constructor({ key, value = null, parent = null }) {
    this.key = key
    this.value = value
    this.parent = parent
    this.children = []
  }
}

class Tree {
  constructor() {
    this.root = null
  }

  add({ key, value, parentId }) {
    const node = new Node({ key, value })

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
      for (let i = 0; i < currentNode.children[i].key; i++) {
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
    if (!this.root) {
      throw new Error("the tree is empty")
    }

    const prettyPrintTree = ({ node = this.root, identation = 0 }) => {
      let tree = ""

      node.children.forEach((child) => {
        const nodeIdentation = " ".repeat(identation)
        const nodeLine = `● node key: ${child.key}`

        tree = `${tree}${LINE_JUMP}${nodeIdentation}${nodeLine}${prettyPrintTree({ node: child, identation: identation + 2 })}`
      })

      return tree
    }

    return console.log(`● node key: ${this.root.key} ${prettyPrintTree({ node: this.root, identation: 2 })}`)
  }
}

export default Tree
