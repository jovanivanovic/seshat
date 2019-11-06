const alasql = require('alasql');

class TableEngine {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.database = null;
    }

    generateTables() {
        this.database = new alasql.Database();

        for (let i = 1; i < this.blockchain.chain.length; i++){
            let block = this.blockchain.chain[i];

            if (block.data.hasOwnProperty('table')) {
                if (block.data.table == true && block.data.hasOwnProperty('query')) {
                    this.database.exec(block.data.query);
                }
            }
        }
    }

    query(query) {
        if (!query.toUpperCase().startsWith('SELECT')) return { error: 'Only SELECT is allowed!' };

        return this.database.exec(query);
    }
}

module.exports = TableEngine;