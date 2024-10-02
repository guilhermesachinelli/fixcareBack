import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const client = new Client({
    authStrategy: new LocalAuth(),
});

// Função para enviar mensagem para um grupo ou contato
async function sendMessage(groupNameOrId, message) {
    try {
        const chats = await client.getChats();
        let groupId = null;

        // Encontra o ID do grupo pelo nome ou ID
        chats.forEach((chat) => {
            if (
                chat.name === groupNameOrId ||
                chat.id._serialized === groupNameOrId
            ) {
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

// Evento para gerar o QR Code
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

// Evento quando o cliente está pronto
client.on("ready", async () => {
    console.log("\nWhatsApp está pronto!\n");
    console.log("Grupos disponíveis:");

    // Listar grupos disponíveis
    try {
        const chats = await client.getChats();
        chats.forEach((chat) => {
            if (chat.isGroup) {
                console.log(`${chat.name}, ID: ${chat.id._serialized}`);
            }
        });
    } catch (err) {
        console.error("Erro ao obter chats:", err);
    }

    // Exemplo de uso
    const groupNameOrId = "120363327750555481@g.us"; // Nome do grupo ou ID
    // const groupNameOrId = "Neca";
    const message =
        "Mensagem TESTE no grupo para projeto Veteranos (npm i whatsapp-web.js)";

    await sendMessage(groupNameOrId, message);
});

// Inicializa o cliente
client.initialize();
