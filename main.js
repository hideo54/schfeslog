const http = require('http');
const url = require('url');
const net  = require('net');
const fs = require('fs');

const settings = require('./settings.json');

if (settings.port) {
    console.log(`Using this port number: ${settings.port}`);
} else {
    console.log('Proxy port number is not specified in settings.json.');
    console.log('Using default port number: 25252')
}

const log = (txt) => {
    fs.appendFile('log.txt', txt, (err) => {
        if (err) throw err;
    });
}

const watcher = (url, body) => {
    log(`${url.hostname}${url.path}\n${body}\n\n`);
    // Do something
}

const proxy = http.createServer( (req, res) => {
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

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        watcher(reqUrl, body);
    });

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
