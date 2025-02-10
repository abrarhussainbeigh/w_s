const axios = require("axios");
require("dotenv").config();

async function checkIfJoined(userId) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`, {
            params: { chat_id: process.env.CHANNEL_ID, user_id: userId },
        });

        const status = res.data.result.status;
        return status === "member" || status === "administrator" || status === "creator";
    } catch (error) {
        console.error("Error checking channel membership:", error);
        return false;
    }
}

module.exports = { checkIfJoined };
