require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const { checkIfJoined } = require("./utils");
const { getAIResponse } = require("./ai");
const { generateReferralCode } = require("./referral");

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_ID = process.env.CHANNEL_ID;

bot.start(async (ctx) => {
    const userId = ctx.from.id;

    // Check if the user has joined the channel
    const isJoined = await checkIfJoined(userId);
    if (!isJoined) {
        return ctx.replyWithPhoto(
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/look-of-a-deer-in-a-rainy-forest-free-image.jpeg?w=1024&quality=50",
            {
                caption: "📢 *Join our channel first!*",
                parse_mode: "Markdown",
                reply_markup: Markup.inlineKeyboard([
                    Markup.button.url("Join Now", `https://t.me/${CHANNEL_ID.replace("@", "")}`),
                    Markup.button.callback("✅ I've Joined", "check_join"),
                ]),
            }
        );
    }

    ctx.reply("✅ Welcome! You can now chat with me.");
});

bot.action("check_join", async (ctx) => {
    const userId = ctx.from.id;
    const isJoined = await checkIfJoined(userId);

    if (isJoined) {
        ctx.editMessageText("✅ Thank you for joining! You can now chat with me.");
    } else {
        ctx.answerCbQuery("❌ You haven't joined yet!", { show_alert: true });
    }
});

bot.on("text", async (ctx) => {
    const userMessage = ctx.message.text.toLowerCase();

    if (userMessage.includes("referral")) {
        return ctx.reply(`🎁 Your referral code: ${generateReferralCode(ctx.from.id)}`);
    }

    const aiReply = await getAIResponse(userMessage);
    ctx.reply(aiReply);
});

bot.launch();
console.log("🤖 Telegram bot is running...");
