require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const maquinasRoutes = require('./routes/maquinasRoutes')
const admRoutes = require('./routes/admRoutes')
const manutencaoRoutes = require('./routes/manutencaoRoutes')
const alunoRoutes = require('./routes/alunoRoutes')
const funcionarioRoutes = require('./routes/funcionarioRoutes')
app.use(cors())
app.use(express.json())
app.use('/', maquinasRoutes);
app.use('/', admRoutes);
app.use('/', manutencaoRoutes);
app.use('/', alunoRoutes);
app.use('/', funcionarioRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})