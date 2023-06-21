import { spawn } from "node:child_process"
import { EventEmitter } from "node:events"
import { getDirectories } from "./helpers/file.js"
import select from "./select.js"

(async function init () {
  const ChoseOptionEmitter = new EventEmitter()

  ChoseOptionEmitter.on("event", function listener (chosenOption) {
    const id = chosenOption.replaceAll(" ", "-")
    spawn("nodemon", [`challenges/${id}/${id}.js`], { shell: true, stdio: "inherit" })
  })

  const folders = await getDirectories(`${process.cwd()}/challenges`)
  const options = folders.map(folder => folder.replaceAll("-", " "))

  select.init({ options, ChoseOptionEmitter })
})()
