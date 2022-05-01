const cheerio = require('cheerio');
const URL = 'http://scpvakfi.wikidot.com/random:random-scp';
const axios = require('axios');
module.exports = async ({}) => {
    const body = await axios.get(URL).catch(() => {
    })
    if (body === undefined) {
        return null;
    }
    const iframe = cheerio.load(body.data)('iframe')[0].attribs.src.replace('https://snippets.wdfiles.com/local--code/code:iframe-redirect#http://scpvakfi.wikidot.com/', '')
    return require("../index.js").search({code: iframe})
}