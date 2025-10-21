const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ message: "Hello Group 1"}))

app.listen(9362, () => console.log("server running on port 9362"))