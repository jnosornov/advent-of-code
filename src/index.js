import { spawn } from "node:child_process"
import { EventEmitter } from "node:events"
import { getDirectories } from "./helpers/file.js"
import select from "./select.js"

(async function init () {
  const { NODE_ENV } = process.env
  const ChoseOptionEmitter = new EventEmitter()

  ChoseOptionEmitter.on("event", function listener (chosenOption) {
    const id = chosenOption.replaceAll(" ", "-")
    const command = NODE_ENV === "prod" ? "node" : "nodemon"
    spawn(command, [`src/challenges/${id}/${id}.js`], { shell: true, stdio: "inherit" })
  })

  // TODO: improve by track/catching
  const folders = await getDirectories(`${process.cwd()}/src/challenges`)
  const options = folders.map(folder => folder.replaceAll("-", " "))

  select.init({ options, ChoseOptionEmitter })
})()
