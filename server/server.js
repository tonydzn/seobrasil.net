import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'OLá QRPointianos vamos criar um artigo?'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,5 // Valores mais altos significam que o modelo assumirá mais riscos.
      max_tokens: 4000, // O número máximo de tokens a serem gerados na conclusão. A maioria dos modelos tem um comprimento de contexto de 2.048 tokens (exceto os modelos mais novos, que suportam 4.096).
      top_p: 1, // alternativa à amostragem com temperatura, chamada amostragem de núcleo
      frequency_penalty: 0.9, // Número entre -2,0 e 2,0. Valores positivos penalizam novos tokens com base em sua frequência existente no texto até o momento, diminuindo a probabilidade do modelo repetir a mesma linha textualmente.
      presence_penalty: 0, // Número entre -2,0 e 2,0. Valores positivos penalizam novos tokens com base em sua presença no texto até o momento, aumentando a probabilidade do modelo falar sobre novos tópicos.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Algo deu errado');
  }
})

app.listen(3000, () => console.log('AI server started on http://localhost:3000'))
