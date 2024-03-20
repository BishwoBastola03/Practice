const fs = require("fs-extra");
const ytdl = require("@neoxr/ytdl-core");
const yts = require("yt-search");
const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "sing",
    version: "69",
    role: 0,
    author: "Yukinori",
    cooldowns: 1,
    shortdescription: "Download music",
    longdescription: "Download music from Youtube",
    category: "media",
    usages: "{pn} <music>",
    dependencies: {
      "fs-extra": "",
      "request": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async ({ api, event }) => {
    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("Please specify a music name!", event.threadID);
    }

    data.shift();
    const musicName = data.join(" ");

    try {
      api.setMessageReaction("🧲", event.messageID, event.messageID, api);

      const searchMessage = await api.sendMessage(`Searching music "${musicName}", please wait...`, event.threadID);

      const searchResults = await yts(musicName);
      if (!searchResults.videos.length) {
        api.sendMessage("No music found.", event.threadID, event.messageID);
        api.unsendMessage(searchMessage.messageID);
        return;
      }

      const music = searchResults.videos[0];
      const musicUrl = music.url;

      const stream = ytdl(musicUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        const fileSize = formatFileSize(fs.statSync(filePath).size);
        const musicDuration = music.duration.timestamp;

        const message = {
          body: `❤ Here's your music -\🎧 Title: ${music.title}\ Duration: ${musicDuration}\? File size: ${fileSize}`,
          attachment: fs.createReadStream(filePath)
        };

        api.setMessageReaction("🎶", event.messageID, event.messageID, api);

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
        api.unsendMessage(searchMessage.messageID);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('Sorry, an error occurred while processing the command.', event.threadID);
    }
  },

  onChat: async function ({ api, event }) {
    const command = event.body.toLowerCase();
    
    if (command === 'sing' || command.startsWith('sing')) {
      await this.onStart({ api, event });
    }
    // Add more conditions or handle other commands here if needed
  },

  onDelete: async function ({ api, event }) {
    // React or perform actions when a message is deleted
    // Example: api.sendMessage("The message was deleted.", event.threadID);
  }
};

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
}