/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('https');
const fs = require('fs');
const querystring = require('querystring');

const LANGUAGES = {
  id: 'id',
  'zh-Hans': 'zh-Hans',
  'zh-Hant': 'zh-Hant-TW',
  ja: 'ja',
  ms: 'my',
};

for (const lang of Object.entries(LANGUAGES)) {
  const file = fs.createWriteStream(`locales/${lang[1]}/messages.po`);

  const postData = querystring.stringify({
    id: 475385,
    language: lang[0],
    type: 'po',
    // filters: 'translated',
    api_token: '332ee3a0a012c0fd18712ad06e72a0ea',
  });

  const options = {
    hostname: 'api.poeditor.com',
    port: 443,
    path: '/v2/projects/export',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
    },
    method: 'POST',
  };

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      const buf = JSON.parse(Buffer.from(d).toString());
      const downloadURL = buf.result.url;
      https.get(downloadURL, (response) => {
        response.pipe(file);
      });
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(postData);
  req.end();
}
