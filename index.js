import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message.content,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const replyText = response.text;

    if (replyText) {
      await message.reply(replyText);
    }
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
import http from 'http';
http.createServer((req, res) => res.end('Nuha está viva')).listen(process.env.PORT || 3000);
