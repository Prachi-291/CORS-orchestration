const net = require('net');

/**
 * Socket-level filtering demonstration.
 * In a real-world scenario, this might be a reverse proxy or a firewall entry.
 * Here we demonstrate a simple TCP proxy that can filter by IP/Host before 
 * passing the traffic to the Express server.
 */

const TARGET_PORT = 3000;
const PROXY_PORT = 4000;

// Whitelist of allowed client IPs (Example)
const ALLOWED_IPS = ['127.0.0.1', '::1'];

const server = net.createServer((socket) => {
    const remoteIp = socket.remoteAddress;
    console.log(`Connection attempt from: ${remoteIp}`);

    if (!ALLOWED_IPS.includes(remoteIp)) {
        console.log(`Blocked connection from unauthorized IP: ${remoteIp}`);
        socket.destroy();
        return;
    }

    // Connect to the actual Express server
    const client = net.connect(TARGET_PORT, 'localhost', () => {
        socket.pipe(client);
        client.pipe(socket);
    });

    client.on('error', (err) => {
        console.error('Proxy target connection error:', err.message);
        socket.end();
    });

    socket.on('error', (err) => {
        console.error('Proxy socket error:', err.message);
        client.end();
    });
});

server.listen(PROXY_PORT, () => {
    console.log(`Socket-level filter (Proxy) running on port ${PROXY_PORT}`);
    console.log(`Filtering incoming connections for port ${TARGET_PORT}...`);
});
