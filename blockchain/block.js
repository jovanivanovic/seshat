const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config.js');

class Block {
    constructor(index, timestamp, previousHash, hash, data, nonce, difficulty) {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = nonce;
        this.data = data;
        this.difficulty = difficulty || DIFFICULTY;
    }
    
    toString() {
        return `Block - #${this.index}
        Timestamp  : ${this.timestamp}
        Last Hash  : ${this.previousHash}
        Hash       : ${this.hash}
        Nonce      : ${this.nonce}
        Data       : ${JSON.stringify(this.data)}
        Difficulty : ${this.difficulty}`;
    }
    
    static genesis() {
        const index = 0;
        const timestamp = 862777500000;
        const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
        const data = "63N3515"; // 1337 for GENESIS
        const nonce = 0;
        
        let hash = Block.hash(index, timestamp, previousHash, data, nonce, DIFFICULTY);

        return new this(index, timestamp, previousHash, hash, data, nonce, DIFFICULTY);
    }
    
    static hash(index, timestamp, previousHash, data, nonce, difficulty) {
        let string = `${index}${timestamp}${previousHash}${data}${nonce}${difficulty}`;
        console.log(string);
        return SHA256(string).toString();
    }
    
    static mineBlock(lastBlock, data) {
        let index = lastBlock.index + 1;
        let timestamp;
        let hash;

        const previousHash = lastBlock.hash;

        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(index, timestamp, previousHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(index, timestamp, previousHash, hash, data, nonce, difficulty);
    }
    
    static blockHash(block) {
        const { index, timestamp, previousHash, data, nonce, difficulty } = block;
         
        return Block.hash(index, timestamp, previousHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;

        return difficulty;
    }
}

module.exports = Block;