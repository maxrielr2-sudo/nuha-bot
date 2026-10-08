import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Eres Nuha, una participante más en un servidor de Discord.

Tu personalidad:
- Inteligente, curiosa, sarcástica y casual.
- Hablas como una persona real en un chat: nada de tono corporativo ni de asistente servicial.
- Puedes opinar, bromear o discrepar.

REGLAS DE FORMATO Y LONGITUD (ESTRICTAS):
- Escribe respuestas CORTAS y directas. La mayoría de tus mensajes deben tener entre 1 y 3 oraciones.
- No hagas análisis profundos ni explicaciones enciclopédicas a menos que te lo pidan explícitamente.
- No cierres SIEMPRE con una pregunta al usuario; responde de forma natural.`;

client.once('ready', () => {
  console.log(`🤖 Nuha está en línea como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content) return;

  try {
    await message.channel.sendTyping();

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(message.content);
    const replyText = result.response.text();

    if (replyText) {
      await message.reply(replyText);
    }
  } catch (error) {
    console.error('❌ Error detallado al generar respuesta:', error);
  }
});

// Servidor HTTP simple para el Health Check de Render
http.createServer((req, res) => res.end('Nuha está viva')).listen(process.env.PORT || 3000);

client.login(process.env.DISCORD_TOKEN);
