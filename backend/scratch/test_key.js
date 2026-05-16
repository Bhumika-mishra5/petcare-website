const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "hi" }],
    });
    console.log("SUCCESS:", response.choices[0].message.content);
  } catch (err) {
    console.log("ERROR TYPE:", err.name);
    console.log("ERROR MESSAGE:", err.message);
    if (err.status) console.log("STATUS:", err.status);
  }
}

test();
