require('dotenv').config()
require('./whatsapp.js');
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const maquinasRoutes = require('./routes/maquinasRoutes')
const admRoutes = require('./routes/admRoutes')
const manutencaoRoutes = require('./routes/manutencaoRoutes')
const alunoRoutes = require('./routes/alunoRoutes')
const funcionarioRoutes = require('./routes/funcionarioRoutes')
const osmanutencaoRoutes = require('./routes/osmanutencaoRoutes.js')
const geradorExcelRoutes = require('./routes/geradorExecelRoutes')
app.use(cors())
app.use(express.json())
app.use('/', maquinasRoutes);
app.use('/', admRoutes);
app.use('/', manutencaoRoutes);
app.use('/', alunoRoutes);
app.use('/', funcionarioRoutes);
app.use('/', osmanutencaoRoutes);
app.use('/', geradorExcelRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})