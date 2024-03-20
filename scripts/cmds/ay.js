const axios = require("axios")
module.exports = {
	config: {
		name: 'leezaai',
        aliases: ["lai"],
		version: '1.2',
		author: 'Yukinori',
		countDown: 0,
		role: 0,
		shortDescription: 'AI CHAT',
		longDescription: {
			en: 'Chat with lina'
		},
		category: 'Ai chat',
		guide: {
			en: '   {pn} <word>: chat with leeza'
				+ '\Example:{pn} hi'
		}
	},

	langs: {
		en: {
			turnedOn: 'successful turned on auto chat leeza!',
			turnedOff: 'successful turned off auto chat leeza!',
			chatting: 'Already Chatting with leeza...',
			error: 'What?🙂'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'en'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }