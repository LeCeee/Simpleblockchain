const SHA256 = require('crypto-js/sha256');
class Transaction {
    constructor(fromAddress ,toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor ( timestamp , transactions, previousHash = '') {
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        // we will use SHA256 cryptographic function to generate this hash
        return SHA256(this.timestamp+this.previousHash+ JSON.stringify(this.transactions)+this.nonce).toString();
    }
    mineNewBlock(difficulty) {
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("a new block was mined with the following hash " + this.hash);
    }
    
}
class BlockChain {
    constructor() {
        //the first block of the block chain is genesis block that we manually create
        this.chain = [this.createGenesis()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }
    createGenesis() {
        return new Block("01/01/2018","this is genesis block","0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }
    minePendingTransactions(mineRewardAddress) {
        let block = new Block(Date.now,this.pendingTransactions,this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("block mined successfully");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,mineRewardAddress,this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }
    getBallanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance = balance- trans.amount;
                }
                if(trans.toAddress === address) {
                    balance = balance+ trans.amount;
                }
            }
        }
        return balance;
    }
    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineNewBlock(this.difficulty);
    //     this.chain.push(newBlock);

    // }
    // we need a new block object
    // hash of the previous block
    // calculate the hash of the current block

    // checking validity of bloack chain
    checkBlockChainValid() {
        for(let i = 1;i<this.chain.length;i++) {
           const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currBlock.hash != currBlock.calculateHash()){
                return false;
            }
            if( currBlock.previousHash != prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


let bittyCoin = new BlockChain();

transaction1 = new Transaction("tom","jerry",100);
bittyCoin.pendingTransactions.push(transaction1);

transaction2 = new Transaction("jerry","tom",30);
bittyCoin.pendingTransactions.push(transaction2);
// a miner has to mine the transactions
console.log("a miner Cee has started mining");
bittyCoin.minePendingTransactions("cee");

console.log("current balance for tom is : "+ bittyCoin.getBallanceOfAddress("tom"));
console.log("current balance for jerry is : "+ bittyCoin.getBallanceOfAddress("jerry"));
console.log("current balance for cee is : "+ bittyCoin.getBallanceOfAddress("cee"));

// miners balance wd be 0 before this as it has to mine its own transations too, they are in the pending queue.
console.log("a miner Cee has started mining again");
bittyCoin.minePendingTransactions("cee");
console.log("current balance for cee is : "+ bittyCoin.getBallanceOfAddress("cee"));

console.log("a miner Cee has started mining again");
bittyCoin.minePendingTransactions("cee");
console.log("current balance for cee is : "+ bittyCoin.getBallanceOfAddress("cee"));

console.log(JSON.stringify(bittyCoin,null,4));

// creating 2 new blocks
// block1 = new Block(1,"02/01/2018",{mybalance : 100});
// block2 = new Block(1,"02/01/2018",{mybalance : 50});

// // creating a block chain
// myBlockChain = new BlockChain();
// console.log("first block creation")
// myBlockChain.addBlock(block1);
// console.log("second block creation")
// myBlockChain.addBlock(block2);

// console.log(JSON.stringify(myBlockChain,null,4));
// console.log("checking validity of block chain before hacking : " + myBlockChain.checkBlockChainValid());

// myBlockChain.chain[1].data = {mybalance:5000};
// console.log("checking validity of block chain before hacking : " + myBlockChain.checkBlockChainValid());
// console.log(JSON.stringify(myBlockChain,null,4));

