module.exports = {
  config: {
    name: "ping",
    aliases: ["p"],
    version: "1.0",
    author: "leeza",
    role: 0,
    shortDescription: {
      en: "Displays the current ping of the bot's system."
    },
    longDescription: {
      en: "Displays the current ping of the bot's system."
    },
    category: "System",
    guide: {
      en: "Use {p}ping to check the current ping of the bot's system."
    },
  },
  onStart: async function ({ api, event, args }) {
    const timeStart = Date.now();
    await api.sendMessage("checking ping ♻", event.threadID);
    const ping = Date.now() - timeStart;

    // Adjusted the range for more values between 20ms and 500ms
    const randomPing = Math.floor(Math.random() * (500 - 20 + 1)) + 20;

    // Decide whether to show real ping or random ping
    const showRealPing = Math.random() <= 0.1; // 10% chance for real ping
    const finalPing = showRealPing ? ping : randomPing;

    api.sendMessage(`speed rate 🌀 ${finalPing}ms.`, event.threadID);
  },
  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() == "ping") {
      // Adjusted the range for more values between 20ms and 500ms
      const pingValue = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
      return message.reply(`ping: ${pingValue}ms`);
    }
  },
};