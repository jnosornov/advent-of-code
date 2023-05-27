const { getDirectories } = require("./helpers/file");
const select = require("./select");

(async function init() {
  const folders = await getDirectories(`${process.cwd()}/challenges`);
  const choices = folders.map(folder => folder.replaceAll("-", " "));
  
  select.init(choices)
})();

