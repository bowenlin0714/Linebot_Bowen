// 引用line機器人及 dotenv 套件
// import必須在檔案最上方
import linebot from 'linebot'
import dotenv  from 'dotenv'
import axios   from 'axios';
import schedule from 'node-schedule';

const bikeLocations = []
const updateData = async () => {
  try{
    const response = await axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json')
  bikeLocations = response.data.retVal
  }catch(err){
    console.log(err);
  }
  
}
schedule.scheduleJob('10 * * * * *', ()=>{
  updateData()
})

dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  try{
    const text = event.message.text
    let reply = ''
    for(const b in bikeLocations) {
      if(bikeLocations[b].sna.includes(event.message.text)){
        reply = bikeLocations[b].sna
        break
      }
    }
    reply = (reply.length === 0) ? '沒有資料' : reply
    event.reply(reply)
  } catch(error){
    event.reply('出現錯誤')
  }
})

bot.listen('/',process.env.PORT , ()=>{
  console.log('我是機器人，你好');
  console.log('機器人已啟動');
})
