require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const { checkIfJoined } = require("./utils");
const { getAIResponse } = require("./ai");
const { generateReferralCode } = require("./referral");

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_ID = process.env.CHANNEL_ID;

// 🟢 START COMMAND (Check Channel Join)
bot.start(async (ctx) => {
    const userId = ctx.from.id;

    // Check if user joined the channel
    const isJoined = await checkIfJoined(userId);
    if (!isJoined) {
        return ctx.replyWithPhoto(
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/look-of-a-deer-in-a-rainy-forest-free-image.jpeg?w=1024&quality=50",
            {
                caption: "📢 *Join our channel first!*\n\n🔹 Click the button below to join, then press '✅ I've Joined'.",
                parse_mode: "Markdown",
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url("🔥 Join Now", "https://t.me/koshurboiiyt")],
                    [Markup.button.callback("✅ I've Joined", "check_join")],
                ]),
            }
        );
    }

    ctx.reply("✅ Welcome! You can now chat with me.");
});

// 🟢 CHECK JOIN STATUS
bot.action("check_join", async (ctx) => {
    const userId = ctx.from.id;
    const isJoined = await checkIfJoined(userId);

    if (isJoined) {
        ctx.editMessageCaption("✅ Thank you for joining! You can now chat with me.");
    } else {
        ctx.answerCbQuery("❌ You haven't joined yet!", { show_alert: true });
    }
});

// 🟢 TEXT MESSAGE HANDLER
bot.on("text", async (ctx) => {
    const userMessage = ctx.message.text.toLowerCase();

    // 🔹 REFERRAL SYSTEM
    if (userMessage.includes("referral")) {
        return ctx.reply(`🎁 Your referral code: \`${generateReferralCode(ctx.from.id)}\``, { parse_mode: "Markdown" });
    }

    // 🔹 PANEL COMMAND
    if (userMessage.includes("panel")) {
        return ctx.replyWithPhoto(
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/look-of-a-deer-in-a-rainy-forest-free-image.jpeg?w=1024&quality=50",
            {
                caption: "😈 *Here you go!*\n\n🔹 Click the button below to access the panel.",
                parse_mode: "Markdown",
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url("⚡ Open Panel", "https://t.me/DeviceLinker_bot")],
                ]),
            }
        );
    }

    // 🔹 AI RESPONSE
    const aiReply = await getAIResponse(ctx.from.id, userMessage);
    ctx.reply(aiReply);
});

// 🟢 START BOT
bot.launch();
console.log("🤖 Telegram bot is running...");
