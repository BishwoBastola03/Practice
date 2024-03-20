const axios = require('axios');

module.exports = {
  config: {
    name: 'nica',
    version: '1.0',
    author: 'Leeza AI',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: {
      en: `Enjoy Nica AI! One of the most advanced technologies from this website.`
    },
    longDescription: {
      en: `Enjoy Nica AI! One of the most advanced technologies from this website.`
    },
    guide: {
      en: '{pn}nica [query]'
    },
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const query = args.join(" ") || "hello";
      const { name } = (await usersData.get(event.senderID));

      if (query) {
        api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
        const processingMessage = await api.sendMessage(
          `Asking 🔎 Nica. Please wait a moment...`,
          event.threadID
        );

        const apiUrl = `https://lianeapi.onrender.com/@LianeAPI_Reworks/api/nica?key=j86bwkwo-8hako-12C&userName=${encodeURIComponent(name || "a user")}&query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
          const trimmedMessage = response.data.message.trim();
          api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
          await api.sendMessage({ body: trimmedMessage }, event.threadID, event.messageID);

          console.log(`Sent 🔎 Nica's response to the user`);
        }
      }
    } catch (error) {
      console.error('Error in onStart function:', error);
    }
  }
};