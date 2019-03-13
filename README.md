Original Paper: [Homomorphic Payment Addresses and the Pay-to-Contract Protocol](https://arxiv.org/pdf/1212.3257.pdf
)
# Pay-to-Contract transaction with signaling output tx.


## Client

- get merchant's pubkey and order-format(JSON format)
- build transaction for buying order and send bitcoin
- upload json to IPFS

## Server

 - watch blockchain to search signaling tx.
 - get IPFS location from signal
 - lookup order contract from ipfs

# development tips

- use insight api on regtest mode: 
   https://www.oodlestechnologies.com/blogs/Create-Bitcoin-Explorer-Using-Bitcoind-And-Bitcore-Insight
- btcregtestinsight: https://github.com/starcharles/btcregtest-insight

# TODO

- [ ] make as a library
- [ ] publish as npm package
- [ ] option to use blockCypher API/ bitcore light client
- [ ] remove OP_RETURN
