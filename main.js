const http = require('http');
const url = require('url');
const net  = require('net');

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
    srvReq.on('error', (err) => {
        console.log('failed');
    });
}).listen(25252);

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
