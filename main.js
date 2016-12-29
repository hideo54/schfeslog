const http = require('http');
const url = require('url');
const net = require('net');
const fs = require('fs');
const process = require('process');
const cheerio = require('cheerio');

let settings = require('./settings.json');
const songData = require('./data.json');

let twitter;
if (settings.twitter.on) twitter = require('./twitter.js');

let server;
try {
    if (settings.server.on) server = require('./server.js');
} catch (TypeError) {
    console.log('v1.2.0~: New update applied. Edit settings.json properly according to settings-sample.json.');
    process.exit();
}

const MAIN_HOST = 'prod-jp.lovelive.ge.klabgames.net';

if (settings.port) {
    console.log(`Using this port number: ${settings.port}`);
} else {
    console.log('Proxy port number is not specified in settings.json.');
    console.log('Using default port number: 25252');
}

if (settings.log) {
    let isAllFalse = true;
    for (section of ['live']) {
        if (Object.keys(settings.log).indexOf(section) === -1) {
            console.log(`Whether ${section} data is logged is not specified.`);
            console.log(`Using default ${section}-logging setting: false`);
            settings.log[section] = false
        } else {
            isAllFalse = false;
        }
    }
    if (isAllFalse) {
        console.log('All log settings are set as false.');
        process.exit();
    }
} else {
    console.log('Log settings are not specified in settings.json.');
    process.exit();
}

const log = (txt) => {
    fs.appendFile('log.txt', txt, (err) => {
        if (err) throw err;
    });
};

const getSongData = (body) => {
    let data;
    for (line of body.split('\n')) {
        if (line[0] === '{') data = JSON.parse(line);
    }
    const id = data.live_difficulty_id.toString(); // type: string
    if (Object.keys(songData).indexOf(id) !== -1) {
        data.title = songData[id].join(' ');
    }
    return data;
}

const watcher = (path, body) => {
    if (settings.log.live) {
        if (path === '/main.php/live/partyList') {
            const song = getSongData(body);
            if (song.title === null) song.title  = 'Not registered';
            console.log(`Selected ${song.live_difficulty_id} (${song.title})`);
        }
        if (path === '/main.php/live/reward') {
            const song = getSongData(body);
            const result = [
                ['SONG', song.title ? song.title : song.live_difficulty_id],
                ['SCORE', song.score_smile + song.score_cute + song.score_cool],
                ['MAX COMBO', song.max_combo],
                ['PERFECT', song.perfect_cnt],
                ['GREAT', song.great_cnt],
                ['GOOD', song.good_cnt],
                ['BAD', song.bad_cnt],
                ['MISS', song.miss_cnt]
            ];
            const resultText = '[LIVE RESULT]\n' + result.map((elm) => {
                return elm.join(': ');
            }).join('\n');
            if (settings.twitter.on) twitter.post(resultText);
            if (settings.server.on) server.post(body, song.title ? song.title : song.live_difficulty_id);
            console.log(resultText);
            log(`-----\n${Date().toString()}\n${resultText}\n`);
        }
    }
};

const proxy = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url);
    const socket = req.socket || req.connection;
    const srvReq = http.request({
        host: reqUrl.hostname,
        port: reqUrl.port || 80,
        path: reqUrl.path,
        method: req.method,
        headers: req.headers,
        agent: socket.$agent
    }, function onsrvRes(srvRes) {
        res.writeHead(srvRes.statusCode, srvRes.headers);
        srvRes.pipe(res);
    });
    req.pipe(srvReq);

    if (reqUrl.hostname === MAIN_HOST) {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            watcher(reqUrl.path, body);
        });
    }

    srvReq.on('error', (err) => {
        console.log('failed');
    });
}).listen(settings.port || 25252);

proxy.on('connect', (req, soc, head) => {
    const reqUrl = url.parse('https://' + req.url);
    const srvSoc = net.connect(reqUrl.port || 443, reqUrl.hostname, () => {
        soc.write('HTTP/1.0 200 Connection established\r\n\r\n');
        if (head && head.length) srvSoc.write(head);
        soc.pipe(srvSoc);
        srvSoc.pipe(soc);
    });
});

proxy.on('connection', (socket) => {
    socket.$agent = new http.Agent({keepAlive: true});
    socket.$agent.on('error', err => console.log('agent:', err));
});
