'use strict';

const fetch = require('node-fetch');
const https = require('https');
const xml2js = require('xml2js');
const { Buffer } = require('buffer');
const { exec } = require('child_process');
const moment = require('moment-timezone');

const now = () => {
  return (new Date()).toISOString();
};

const format = (date) => {
  return moment(date).tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
}

// AuthToken と PartialKey を返す。
const authorization1 = () => {
  const AUTHKEY = 'bcd151073c03b352e1ef2fd66c32209da9ca0afa';
  const URL = `https://radiko.jp/v2/api/auth1_fms`;

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  return fetch(URL, {
    method: 'POST',
    headers: {
      'pragma': 'no-cache',
      'X-Radiko-App': 'pc_html5',
      'X-Radiko-App-Version': '0.0.1',
      'X-Radiko-User': 'test-stream',
      'X-Radiko-Device': 'pc',
    },
    agent: httpsAgent,
    body: '',
  })
    .then(response => {
      return response.text();
    })
    .then(text => {
      const headers = {};

      const lines = text.split('\r\n');
      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (value) {
          headers[key.toUpperCase()] = value;
        }
      });

      const partialKey = toPartialKey(AUTHKEY, Number(headers['X-RADIKO-KEYOFFSET']), Number(headers['X-RADIKO-KEYLENGTH']));
      return [headers['X-RADIKO-AUTHTOKEN'], partialKey];
    });
};

const authorization2 = (token, partialKey) => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const URL = `https://radiko.jp/v2/api/auth2_fms`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      'pragma': 'no-cache',
      'X-Radiko-User': 'dummy-user',
      'X-Radiko-Device': 'pc',
      'X-Radiko-AuthToken': token,
      'X-Radiko-PartialKey': partialKey,
    },
    agent: httpsAgent,
    body: '',
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('authorization2 failed');
      }
    })
}


const getStreamUrl = (channel) => {
  const URL = `http://radiko.jp/v2/station/stream_smh_multi/${channel}.xml`
  return fetch(URL)
    .then(response => {
      return response.text();
    })
    .then(text => {
      return xml2js.parseStringPromise(text, { mergeAttrs: true });
    })
    .then(xml => {
      return xml.urls?.url?.[0].playlist_create_url?.[0]
    })
}

const toPartialKey = (key, offset, length) => {
  const partialKey = key.slice(offset, offset + length);
  return Buffer.from(partialKey).toString('base64');
}

const downloadFromRadiko = (authToken, url, duration, filename) => {
  const command = [
    `ffmpeg`,
    `-loglevel error`,
    `-t ${duration}`,
    `-fflags +discardcorrupt`,
    `-headers "X-Radiko-Authtoken: ${authToken}"`,
    `-y -i ${url}`,
    `-bsf:a aac_adtstoasc`,
    `-c copy "${filename}.m4a"`
  ];

  return new Promise((resolve, reject) => {
    exec(command.join(' '), (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(now(), 'downloaded', filename);
        resolve();
      }
    });
  })
}

const downloadFromNhkOnDemand = (url, duration, filename) => {
  const command = [
    `ffmpeg`,
    `-loglevel error`,
    `-t ${duration}`,
    `-fflags +discardcorrupt`,
    `-y -i ${url}`,
    `-bsf:a aac_adtstoasc`,
    `-c copy "${filename}.m4a"`
  ];

  return new Promise((resolve, reject) => {
    exec(command.join(' '), (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(now(), 'downloaded', filename);
        resolve();
      }
    });
  })
}

module.exports = {
  now,
  format,
  authorization1,
  authorization2,
  getStreamUrl,
  toPartialKey,
  downloadFromRadiko,
  downloadFromNhkOnDemand,
};
