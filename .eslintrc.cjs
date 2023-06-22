module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true
  },
  extends: "standard",
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        ".eslintrc.{js,cjs}"
      ],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    quotes: [2, "double"]
  }
}
