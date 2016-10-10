const Twitter = require('twitter');
const process = require('process');

const settings = require('./settings.json');

const client = new Twitter(settings.twitter);

let twitterModule = {};
twitterModule.post = (text) => {
    client.post('statuses/update', {status: text}, (err, tweet, res) => {
        if (err) throw err;
        return res;
    });
};

module.exports = twitterModule;
