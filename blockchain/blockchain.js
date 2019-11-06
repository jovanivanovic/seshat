const Block = require('./block');

class Blockchain {
    constructor(db) {
        this.db = db;
        this.chain = [];

        this.db.find({}).sort({ index: 1 }).exec((err, chain) => {
            if (chain.length == 0) {
                let genesis = Block.genesis();

                this.chain.push(genesis);
                this.db.insert(genesis);
            } else {
                this.chain = chain;
            }
        }); 
    }
  
    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);

        this.chain.push(block);
        this.db.insert(block);

        global.signale.block(`Added a new block to the chain: ${block.hash}`);

        return block;
    }
  
    compareGenesis(genesis1, genesis2) {
        delete genesis1._id;
        delete genesis2._id;

        if (JSON.stringify(genesis1) !== JSON.stringify(genesis2)) return false;

        return true;
    }

    validateChain(chain) {
        if (!this.compareGenesis(chain[0], Block.genesis())) { return false; }

        for (let i = 1; i < chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if ((block.previousHash !== lastBlock.hash) || (block.hash !== Block.blockHash(block))) {
                // VALIDATION SOMETIMES FAWKING FAILS, BE A DETECTIVE, FIND OUT WHY
                // TODO: REMOVE THIS SHITTY DEBUG STUFF

                console.log(`(block.hash !== Block.blockHash(block)`);
                console.log(`${block.hash} !== ${Block.blockHash(block)}`);
                console.log(block);

                return false;
            }
        }

        return true;
    }
    
    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            global.signale.info(`Received chain is not longer than the current chain`);
            return;
        } else if (!this.validateChain(newChain)){
            global.signale.error(`Received chain is invalid`);
            return;
        }
        
        global.signale.success(`Replacing the current chain with the new chain`);
        
        this.chain = newChain;

        this.db.remove({}, { multi: true }, (err, count) => {
            this.db.insert(newChain);
        });
    }
}

module.exports = Blockchain;