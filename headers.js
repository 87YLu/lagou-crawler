const { cookie } = require('./config')

module.exports = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
  'Sec-fetch-dest': 'empty',
  'Sec-fetch-mode': 'cors',
  'Sec-fetch-site': 'same-site',
  'x-l-req-header': '{deviceType:1}',
  Referer: 'https://kaiwu.lagou.com/',
  Origin: 'https://kaiwu.lagou.com/',
  Cookie: `edu_gate_login_token=${cookie}`,
}
