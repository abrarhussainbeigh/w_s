const axios = require("axios");
require("dotenv").config();

async function getAIResponse(userInput) {
    try {
        const prompt = `You are a friendly Telegram bot named DeviceLinker. 
        Your role is to help users with their queries in a simple and fun way.
        Only reply in short, simple sentences. Keep it engaging and easy to understand.
        If the user asks something irrelevant, politely say "I don't know that yet!". 
        User: "${userInput}" 
        Bot:`;

        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${process.env.GEMINI_API_KEY}`,
            { prompt: { text: prompt } }
        );

        return res.data.candidates?.[0]?.output || "I'm here to help!";
    } catch (error) {
        console.error("AI API error:", error);
        return "There was an error processing your request.";
    }
}

module.exports = { getAIResponse };
