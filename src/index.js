require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const maquinasRoutes = require('./routes/maquinasRoutes')
const admRoutes = require('./routes/admRoutes')
const lubrificacaoRoutes = require('./routes/lubrificacaoRoutes')
const manutencaoRoutes = require('./routes/manutencaoRoutes')
const alunoRoutes = require('./routes/alunoRoutes')
app.use(cors())
app.use(express.json())
app.use('/', maquinasRoutes);
app.use('/', admRoutes);
app.use('/', lubrificacaoRoutes);
app.use('/', manutencaoRoutes);
app.use('/', alunoRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})