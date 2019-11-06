const WebSocket = require('ws');

class P2Pserver {
    constructor(blockchain, port = 5001, peers = [], tableEngine = null) {
        this.blockchain = blockchain;
        this.port = port;
        this.peers = peers;
        this.sockets = [];
        this.tableEngine = tableEngine;
    }

    listen() {
        const server = new WebSocket.Server({ port: this.port });

        server.on('connection', (socket, req) => {
            this.connectSocket(socket, req);
        });

        this.connectToPeers();

        global.signale.success(`Seshat P2P server listening on port ${this.port}`);
    }

    connectSocket(socket, req) {
        this.sockets.push(socket);
        
        global.signale.success(`Socket connected`);

        this.messageHandler(socket);
        this.sendChain(socket);
    }

    connectToPeers() {
        this.peers.forEach((peer, index) => {
            const socket = new WebSocket(peer);

            socket.on('open', () => {
                this.connectSocket(socket);
            });
        })
    }

    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message);
            global.signale.info(`Received data: ${message}`);

            this.blockchain.replaceChain(data);

            if (this.tableEngine != null) {
                this.tableEngine.generateTables();
            }
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChain() {
        this.sockets.forEach((socket, index) => {
            this.sendChain(socket);
        });
    }
}

module.exports = P2Pserver;