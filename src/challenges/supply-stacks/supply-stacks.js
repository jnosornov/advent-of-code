import { NEW_LINE } from "../../constants.js"
import { getFileContent } from "../../helpers/file.js"
import { collectFruits, logFruits, run } from "../../helpers/general.js"

export default async function init({ fruit }) {
  const contents = await getFileContent({
    path: new URL(filename, import.meta.url),
    opts: (entry) => {
      return entry.split(NEW_LINE)
    }
  })

  const { input: [crates, rearrangementProcedure] } = contents

  const fruits = collectFruits({ fruit, callbacks: [fruitOne] })
  const { fruit1 } = fruits

  logFruits({
    title: "Supply Stacks",
    fruitOne: {
      message: fruit1 ? `` : null
    }
  })

  return fruits

  function fruitOne() {
    return "ZMC"
  }
}

run(() => init({ fruit: "1" }))