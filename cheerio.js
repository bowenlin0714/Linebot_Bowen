import axios from 'axios'
import cheerio from 'cheerio'

const getContent = async () => {
  const res = await axios.get('https://www.easycamp.com.tw/Push_Camp_4_20_0.html') 
  const $ = cheerio.load(res.data)
  for (let i = 0; i < $('.col-md-6.col-sm-12.col-xs-12 h3').length; i++) {
    console.log($('.col-md-6.col-sm-12.col-xs-12 h3').eq(i).text());
  }
}

getContent()