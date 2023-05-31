import { spawn } from "node:child_process"
import { EventEmitter } from "node:events"
import { getDirectories } from "./helpers/file.js"
import select from "./select.js"

(async function init() {
  const ChoseOptionEmitter = new EventEmitter()

  ChoseOptionEmitter.on("event", function listener(chosenOption) {
    const id = chosenOption.replaceAll(" ", "-");
    const child = spawn("nodemon", [`challenges/${id}/${id}.js`], { shell: true })

    child.stdout.on("data", (data) => {
      process.stdout.write(data);
    })

    child.stderr.on("data", (data) => {
      console.log("failed");
      process.stdout.write(data)
    })
  });

  const folders = await getDirectories(`${process.cwd()}/challenges`);
  const options = folders.map(folder => folder.replaceAll("-", " "));
  
  select.init({ options, ChoseOptionEmitter })
})();

