'use strict';

require('dotenv').config();
const moment = require('moment-timezone');
const crypto = require('crypto')
const fetch = require('node-fetch');
const utils = require('./utils.js');
const fastify = require('fastify')({
  logger: true
})

// lsid はランダムな文字列で良いっぽい
const lsid = () => {
  const now = new Date();
  const md5 = crypto.createHash('md5')
  return md5.update(`${now.getTime()}`, 'binary').digest('hex')
}

fastify.post('/', async (request, reply) => {

  await fetch('https://checkip.amazonaws.com/')
    .then(response => {
      return response.text();
    })
    .then(text => {
      console.log(text);
    })
    .catch((err) => {
      throw new Error(`checkip.amazonaws.com failed ${err}`);
    });

  const CHANNEL = 'FMT';
  const START = new Date('2023-06-23T08:00:00+09:00');
  const END = new Date('2023-06-23T08:30:00+09:00');
  const FILENAME = 'output.m4a';
  const BUCKET = 'radiko-test-files';

  try {
    const [token, partialKey] = await utils.authorization1();
    await utils.authorization2(token, partialKey);

    console.log(token, partialKey);

    const start = moment(START).tz("Asia/Tokyo").format('YYYYMMDDHHmmss');
    const end = moment(END).tz("Asia/Tokyo").format('YYYYMMDDHHmmss');

    // https://radiko.jp/v3/station/stream/pc_html5/${CHANNEL}.xml の定義から
    const URL = 'https://radiko.jp/v2/api/ts/playlist.m3u8';

    const url = `${URL}?station_id=${CHANNEL}&start_at=${start}&ft=${start}&end_at=${end}&to=${end}&l=15&lsid=${lsid()}&type=b`;
    await utils.downloadFromRadiko(token, url, null, FILENAME);

    await utils.upload('id', BUCKET, FILENAME, FILENAME);

    console.log('finish');
  } catch (err) {
    console.error(err);
  }




  reply
    .code(200)
    .send('ok')
})

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 8080, '0.0.0.0')

  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

