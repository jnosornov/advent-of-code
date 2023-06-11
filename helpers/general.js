function run(callback) {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === "test") return;
  callback();
}

function collectFruits({ fruit = "1", callbacks = [] }) {
  if (!callbacks.length) return
  const [cb1, cb2] = callbacks

  if (fruit === "1") {
    return {
      fruit1: cb1()
    }
  }

  if (fruit === "2") {
    return {
      fruit2: cb2()
    }
  }

  if (fruit === "both") {
    return {
      fruit1: cb1(),
      fruit2: cb2()
    }
  }
}

export {
  run,
  collectFruits
}