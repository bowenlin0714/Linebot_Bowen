// 引用line機器人及 dotenv 套件
// import必須在檔案最上方
import linebot from 'linebot'
import dotenv  from 'dotenv'
import axios   from 'axios';
import schedule from 'node-schedule';

let bikeLocations = []
const updateData = async () => {
  try{
    const Taipeibike = await axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json')
    bikeLocations = Taipeibike.data.retVal
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
    let texts = event.message.text
    let reply ={}
    for(const b in bikeLocations) {
      if(bikeLocations[b].sna.includes(texts)){
       
        let results = {
          type: 'template',
          altText: 'this is a buttons template',
          template: {
            type: 'buttons',
            thumbnailImageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/455bcb41754207.57b32e52eda95.jpg',
            title: bikeLocations[b].sna,
            text: `${bikeLocations[b].snaen}\n可借數量 :${bikeLocations[b].sbi} \n可還數量 :${bikeLocations[b].bemp}`,
            actions: [ {
              type: 'message',
              label: '看詳細地址',
              text: bikeLocations[b].sna + '詳細地址'
            },
            {
              type: 'message',
              label: '看位置地圖',
              text: bikeLocations[b].sna + '位置地圖'
            }]
          }
        }
        reply = results
        
      }
      if(texts === bikeLocations[b].sna + '詳細地址'){
        reply={
          type: 'text', 
          text: bikeLocations[b].ar
        }
      }
      if(texts === bikeLocations[b].sna + '位置地圖'  ){
        reply={
          type: 'location',
          title: 'youbike location',
          address:bikeLocations[b].sna,
          latitude: bikeLocations[b].lat,
          longitude: bikeLocations[b].lng
        }
      }
      // 錯誤代碼查詢
      if( texts === '錯誤代碼'){
        reply={
          type: "image",
          originalContentUrl: "https://i.imgur.com/o9RzK4g.png",
          previewImageUrl: "https://i.imgur.com/o9RzK4g.png"
        }
      }      
    }
    // 不符合時回傳
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
