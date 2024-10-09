const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
//const pool = require('./config/dbConfig.js'); // Certifique-se de que o pool de conexão está configurado corretamente

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log('Escaneie o QR code abaixo para autenticar no WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente do WhatsApp está pronto!');
});

client.initialize();

async function getSemanal() {
    try {
        console.log('Executando consulta getSemanal...');
        const query = (`
            WITH dias_da_semana AS (
                SELECT DISTINCT data_de_manutencao::date AS data
                FROM maintenance
                WHERE DATE_PART('dow', data_de_manutencao) BETWEEN 1 AND 5
            )
            SELECT 
                machine.numero_de_patrimonio AS numero_de_patrimonio,
                TO_CHAR(dias_da_semana.data, 'DD/MM/YYYY') AS data,
                TO_CHAR(dias_da_semana.data, 'FMDay') AS dia_da_semana,
                CASE 
                    WHEN maintenance.data_de_manutencao IS NOT NULL THEN 'Lubrificada'
                    ELSE 'Não Lubrificada'
                END AS status_lubrificacao
            FROM 
                machine
            CROSS JOIN 
                dias_da_semana
            LEFT JOIN 
                maintenance 
            ON 
                machine.numero_de_patrimonio = maintenance.numero_de_patrimonioid 
                AND maintenance.data_de_manutencao = dias_da_semana.data
            WHERE 
                maintenance.data_de_manutencao IS NULL
            ORDER BY 
                dias_da_semana.data, machine.numero_de_patrimonio
        `);

        const response = await pool.query(query);
        console.log('Consulta getSemanal executada com sucesso.');
        return response.rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

// Função para enviar mensagem para um grupo ou contato
async function sendMessage(groupNameOrId, message) {
    try {
        console.log(`Enviando mensagem para ${groupNameOrId}...`);
        const chats = await client.getChats();
        let groupId = null;

        // Encontra o ID do grupo ou contato pelo nome ou ID
        chats.forEach(chat => {
            if (chat.name === groupNameOrId || chat.id._serialized === groupNameOrId) {
                groupId = chat.id._serialized;
            }
        });

        if (groupId) {
            await client.sendMessage(groupId, message);
            console.log(`\nMensagem enviada para ${groupNameOrId}:\n${message}`);
        } else {
            console.log(`\nGrupo ou contato não encontrado: ${groupNameOrId}`);
        }
    } catch (err) {
        console.error("\nErro ao enviar mensagem:", err);
    }
}

async function sendWeeklyReport() {
    try {
        console.log('Iniciando envio do relatório semanal...');
        const manutencoes = await getSemanal();
        let message = 'Relatório de Lubrificações da Semana:\n\n';

        manutencoes.forEach(manutencao => {
            message += `Máquina: ${manutencao.numero_de_patrimonio}\n`;
            message += `Data: ${manutencao.data}\n`;
            message += `Dia da Semana: ${manutencao.dia_da_semana}\n`;
            message += `Status: ${manutencao.status_lubrificacao}\n\n`;
        });

        console.log('Mensagem montada:', message);

        // Substitua 'Nome do Grupo' pelo nome do grupo ou ID do contato
        await sendMessage(process.env.GROUPID, message);
    } catch (error) {
        console.error('Erro ao enviar o relatório semanal:', error);
    }
}

// Agendar a tarefa para ser executada a cada minuto (para testes)
cron.schedule('* * * * *', () => {
    console.log('Executando tarefa agendada para enviar mensagem no WhatsApp...');
    sendWeeklyReport();
});