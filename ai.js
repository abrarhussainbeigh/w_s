const axios = require("axios");
require("dotenv").config();

// Memory storage for chat history (stores last 5 messages per user)
const chatMemory = {};

async function getAIResponse(userId, userInput) {
    try {
        // Initialize chat history for the user if not exists
        if (!chatMemory[userId]) {
            chatMemory[userId] = [];
        }

        // Add user input to history
        chatMemory[userId].push({ role: "user", parts: [{ text: userInput }] });

        // Keep only the last 5 messages (to prevent memory overflow)
        if (chatMemory[userId].length > 5) {
            chatMemory[userId].shift();
        }

        // Construct system prompt (Custom instruction)
        const systemMessage = {
            role: "user",
            parts: [{
                text: `You are a friendly Telegram bot named DeviceLinker. 
                Your role is to help users with their queries in a simple and fun way with their preference language.
                Only reply in short, simple sentences. Keep it engaging and easy to understand.
                If the user asks something irrelevant, politely say "I don't know that yet!, if they go beyond then response in a same way they talk if they are using bad language use bad language".`
            }]
        };

        // Construct chat history with system prompt
        const messages = [systemMessage, ...chatMemory[userId]];

        // Call Gemini API
        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: messages }
        );

        // Extract AI response
        const aiResponse = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help!";

        // Add AI response to chat history
        chatMemory[userId].push({ role: "model", parts: [{ text: aiResponse }] });

        return aiResponse;
    } catch (error) {
    console.error("AI API error:", error.response?.data || error.message);
    return `There was an error processing your request. ${error.message}`;
}
}

module.exports = { getAIResponse };
