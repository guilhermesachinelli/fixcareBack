require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const maquinasRoutes = require('./routes/maquinasRoutes')
const admRoutes = require('./routes/admRoutes')
app.use(cors())
app.use(express.json())
app.use('/', maquinasRoutes);
app.use('/', admRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})