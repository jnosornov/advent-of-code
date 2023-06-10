import { marked } from "marked"
import { getFileContent } from "../helpers/file.js"
import TerminalRenderer from "marked-terminal"

marked.setOptions({
  mangle: false,
  headerIds: false,
  renderer: new TerminalRenderer()
})

const getChallengeMarkdown = async (challenge) => {
  const id = challenge.replaceAll(" ", "-")
  const contents = await getFileContent({
    path: `src/challenges/${id}/${id}.md`
  });

  return marked.parse(contents)
}

export default getChallengeMarkdown