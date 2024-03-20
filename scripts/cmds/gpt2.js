var {get}=require('axios');
var config={name:'gpt2',version:'1.0',author:'Finn Fetcher'/** I don't care if you want to change it or not, if you want to change it, go ahead. */,countDown:5,role:0,longDescription:'Chat GPT',category:'ai',guide:{en:'{pn} <query>'}};
var onStart=async({message,event,args,api})=>{
  if(!event.isGroup)return message.send("You are not allowed to DM the Bot");//just delete this if not necessary 
  const prompt=args.join(' ');
  if(!args[0])return message.reply('Please enter a query. 🗿');
  const mid=event.messageID;
  message.send('𝗚𝗣𝗧 is thinking...');
  await gpt(prompt,event.senderID,message,mid,api);
};var onReply=async({Reply,event,api,message})=>{
  const{author}=Reply;
  if(author!==event.senderID)return;
  const mid=event.messageID;
  const prompt=event.body;
  await gpt(prompt,event.senderID,message,mid,api);
};
async function gpt(text,userID,message,mid,api){
  try{
    const пр =`https://celestial-dainsleif.onrender.com/gpt?gpt=${encodeURIComponent(text)}`;//credits to the owner of this APi
    const tx =(await get(пр)).data.content;
    message.reply(`𝗚𝗣𝗧\n\n${tx}`,(error,info)=>global.GoatBot.onReply.set(info.messageID,{commandName:'gpt',author:userID}));
  }catch(error){
    message.send('Uhh, can u say that again?');
  }
}
module.exports={config,onStart,onReply};