module.exports = {
  config: {
    name: "yukinori",
    version: "1.0",
    author: "yukinori",
    countDown: 5,
    role: 2,
    shortDescription: "muji bot le left garxa group",
    longDescription: "remove bot  from group",
    category: "fun",
  },
  onStart: async function () {},
  onChat: async function ({ event, api, getLang }) {
    // taile haleko word xaki ai vanera herxa for example "land" yo rakhe check garxa 
    if (event.body && event.body.toLowerCase() === "yukinori") {
      // muji k rakera left garaunehos ho tai word rakh yesma "" yo vitra 
      const threadID = event.threadID;
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    }
  },
};