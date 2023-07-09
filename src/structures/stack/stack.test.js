import Stack from "./stack.js"
import { deepEqual, equal } from "assert"

describe("Stack", () => {
  it("adds an element to the stack", () => {
    const stack = new Stack()
    stack.push("a")

    deepEqual(stack.elements, { 1: "a" })
  })

  it("elements are added at the end of the stack", () => {
    const stack = new Stack()
    stack.push("a")
    stack.push("b")
    stack.push("c")

    deepEqual(stack.elements, { 1: "a", 2: "b", 3: "c" })
  })

  it("removes an element from the top", () => {
    const stack = new Stack()
    stack.push("a")
    stack.push("b")
    stack.pop()

    deepEqual(stack.elements, { 1: "a" })
  })

  it("throws an error when stack is empty and an element is request to be removed", () => {
    const stack = new Stack()

    try {
      stack.pop()
    } catch (e) {
      equal(e.message, "the stack is empty")
    }
  })
})
