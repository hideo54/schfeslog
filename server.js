const request = require('request');
const settings = require('./settings.json');

let serverModule = {};

const parseRequestData = (body) => {
    let data;
    for (line of body.split('\n')) {
        if (line[0] === '{') data = JSON.parse(line);
    }
    return data;
}

serverModule.post = (body, songName) => {
    let data;
    data = parseRequestData(body);
    options = {
        uri: settings.server.uri,
        headers: {
            "Content-type": "application/json",
        },
        json: {
          "password": settings.server.password,
          "songId": data.live_difficulty_id,
          "songName": songName,
          "score": data.score_smile + data.score_cute + data.score_cool,
          "maxCombo": data.max_combo,
          "perfect": data.perfect_cnt,
          "great": data.great_cnt,
          "good": data.good_cnt,
          "bad": data.bad_cnt,
          "miss": data.miss_cnt
        }
    };
    request.post(options, (error, response, body) => {
      if (error) throw error;
      return response;
    });
};

module.exports = serverModule;
