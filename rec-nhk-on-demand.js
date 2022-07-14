'use strict';

const utils = require('./utils.js');

const STREAMING_URL = {
  r1: "https://radio-stream.nhk.jp/hls/live/2023229/nhkradiruakr1/master.m3u8",  // NHKラジオ第1
  r2: "https://radio-stream.nhk.jp/hls/live/2023501/nhkradiruakr2/master.m3u8",  // NHKラジオ第2
  r3: "https://radio-stream.nhk.jp/hls/live/2023507/nhkradiruakfm/master.m3u8",  // NHKFM
};

if (process.argv.length !== 5) {
  console.log('usage: node rec-nhk-on-demand.js {r1|r2|r3} duration filename');
  console.log('');
  console.log('Example usage:');
  console.log('  node rec-nhk-on-demand.js r3 120 "ベストオブクラシック"');
  process.exit(-1);
}

const CHANNEL = process.argv[2];
const DURATION = Number(process.argv[3]) * 60;  // [sec]
const FILENAME = process.argv[4];

(async () => {
  try {
    const url = STREAMING_URL[CHANNEL];

    await utils.downloadFromNhkOnDemand(url, DURATION, FILENAME);

  } catch (err) {
    console.error(err);
    process.exit(-1)
  }
})();
