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

  add({ key, value, parent }) {
    const node = new Node({ key, value })

    if (!this.root) {
      this.root = node
      return
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
}

export default Tree
