import express from "express"
const app = express()
const PORT = process.env.PORT || 3000

app.get("/healthcheck", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: "OK",
    timestamp: Date.now()
  }

  try {
    res.send(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.status(503).send()
  }
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
