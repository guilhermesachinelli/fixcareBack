const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const pool = require('./config/dbConfig.js'); // Certifique-se de que o pool de conexão está configurado corretamente

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
            SELECT machine.numero_de_patrimonio, d.date
            FROM machine
            CROSS JOIN (
            SELECT CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 5) AS date
            ) d 
            LEFT JOIN maintenance mt
            ON mt.numero_de_patrimonioID = machine.numero_de_patrimonio
            AND mt.tipo_de_manutencao = 'Lubrificação'
            AND mt.data_de_manutencao = d.date
            WHERE mt.numero_de_patrimonioID IS NULL
            ORDER BY machine.numero_de_patrimonio, d.date;
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

async function sendDailyMessage() {
    try {
        const message = 'Bom dia! Lembre-se de lubrificar as máquinas hoje.';

        console.log('Mensagem montada:', message);

        // Substitua 'Nome do Grupo' pelo nome do grupo ou ID do contato
        await sendMessage(process.env.GROUPID, message);
    } catch (error) {
        console.error('Erro ao enviar a mensagem diária:', error);
    }
}

// Função para formatar a mensagem
// Função para formatar a mensagem
function formatMessage(data) {
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const unlubricatedMachines = {};

    data.forEach(row => {
        const patrimonio = row.numero_de_patrimonio;
        const date = new Date(row.date);
        const dayOfWeek = daysOfWeek[date.getDay() - 1]; // Ajusta o índice para começar na segunda-feira

        if (!unlubricatedMachines[patrimonio]) {
            unlubricatedMachines[patrimonio] = [];
        }

        unlubricatedMachines[patrimonio].push(dayOfWeek);
    });

    let message = '*Lubrificação:*\n\n'; // Adiciona o título em negrito no início da mensagem
    for (const patrimonio in unlubricatedMachines) {
        message += `Número de patrimônio da máquina: ${patrimonio}\n`;
        message += `Dias que não foram lubrificados na semana:\n`;

        // Ordena os dias da semana na ordem correta
        const sortedDays = unlubricatedMachines[patrimonio].sort((a, b) => {
            return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
        });

        message += sortedDays.join('\n');
        message += '\n\n';
    }

    return message.trim(); // Remove espaços em branco extras no final da mensagem
}
// Função para enviar o relatório semanal
async function sendWeeklyReport() {
    try {
        const data = await getSemanal(); // Substituído por getSemanal
        const message = formatMessage(data);

        console.log('Mensagem montada:', message);

        // Substitua 'Nome do Grupo' pelo nome do grupo ou ID do contato
        await sendMessage(process.env.GROUPID, message);
    } catch (error) {
        console.error('Erro ao enviar o relatório semanal:', error);
    }
}
// Agendar a tarefa diária para ser executada às 8h da manhã
cron.schedule('* 8 * * *', () => {
    console.log('Enviando mensagem diária às 8h da manhã...');
    sendDailyMessage();
});

// Agendar a tarefa semanal para ser executada às 8h da manhã nas sextas-feiras
cron.schedule('* 8 * * 5', () => {
    console.log('Enviando relatório semanal às 8h da manhã na sexta-feira...');
    sendWeeklyReport();
});
module.exports = { sendMessage};