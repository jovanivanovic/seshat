const { SIGNALE_OPTIONS } = require('./config.js');
const yargs = require('yargs');
const express = require('express');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const Datastore = require('nedb');
const { Signale } = require('signale');

const Blockchain = require('./blockchain/blockchain');
const TableEngine = require('./tables/table_engine');
const P2Pserver = require('./p2p_server');

let httpPort = 3001;
let p2pPort = 5001;
let peers = [];
let databasePath = './_db/ledger.db';

const argv = yargs
    .option('port', { 
        description: "Sets the HTTP Server's port",
        alias: 'p',
        type: 'number'
    })
    .option('p2p_port', { 
        description: "Sets the P2P Server's port",
        alias: 'x',
        type: 'number'
    })
    .option('peers', { 
        description: "Sets the P2P Server's peers (comma-separated)",
        alias: 's',
        type: 'string'
    })
    .option('database', {
        description: "Sets the path to the database file (.db)",
        alias: 'd',
        type: 'string'
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.port) {
    httpPort = argv.port;
}

if (argv.p2p_port) {
    p2pPort = argv.p2p_port;
}

if (argv.peers) {
    peers = argv.peers.split(',');
}

if (argv.database) {
    databasePath = argv.database;
}

global.signale = new Signale(SIGNALE_OPTIONS);

const app = express();
const db = new Datastore({ filename: databasePath, autoload: true });
const blockchain = new Blockchain(db);
const tableEngine = new TableEngine(blockchain);
const p2pserver = new P2Pserver(blockchain, p2pPort, peers, tableEngine);

let multipartMiddleware = multipart();

tableEngine.generateTables();
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    global.signale.success(`Added new block: ${block.hash}`);

    res.redirect('/blocks');

    p2pserver.syncChain();
    tableEngine.generateTables();
});

app.get('/query', (req, res) => {
    res.json(tableEngine.query(req.body.query));
});

app.listen(httpPort, () => {
    global.signale.success(`Seshat HTTP server listening on port ${httpPort}`);
});

p2pserver.listen();