class Stack {
  constructor() {
    this.elements = {}
    this.top = 0
  }

  push(element) {
    this.top = this.top + 1
    this.elements[this.top] = element
  }

  pop() {
    const isStackEmpty = this.top === 0
    if (isStackEmpty) {
      throw Error("the stack is empty")
    }

    const element = this.elements[this.top]
    delete this.elements[this.top]
    this.top = this.top - 1
    return element
  }

  peek() {
    return this.elements[this.top]
  }
}

export default Stack
