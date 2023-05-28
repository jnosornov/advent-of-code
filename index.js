const { EventEmitter } = require("events");
const { getDirectories } = require("./helpers/file");
const select = require("./select");

(async function init() {
  const ChoseOptionEmitter = new EventEmitter()

  ChoseOptionEmitter.on("event", function listener(chosenOption) {
    // TODO: run the script, try using a child process
    console.log("Chose Option:", chosenOption);
  });

  const folders = await getDirectories(`${process.cwd()}/challenges`);
  const options = folders.map(folder => folder.replaceAll("-", " "));
  
  select.init({ options, ChoseOptionEmitter })
})();

