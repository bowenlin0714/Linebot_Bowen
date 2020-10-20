// 引用line機器人及 dotenv 套件
// import必須在檔案最上方
import linebot from 'linebot'
import dotenv  from 'dotenv'
import axios   from 'axios';

dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  try{
    const res = await axios.get('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=8')
    const text = event.message.text
    let reply = ''
    for(const data of res.data) {
      if(data.title === text){
        reply = data.showInfo[0].locationName
        break
      }
    }
    reply = (reply.length === 0) ? '找不到資料' : reply
    event.reply(reply)
  } catch(error){
    event.reply('出現錯誤')
  }
})

bot.listen('/',process.env.PORT , ()=>{
  console.log('我是機器人，你好');
  console.log('機器人已啟動');
})
