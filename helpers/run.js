function run(callback) {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === "test") return;
  callback();
}

export default run;
