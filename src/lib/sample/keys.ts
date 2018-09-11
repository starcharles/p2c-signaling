const merchantKey = {
	mnemonic: "flight uncle argue ring gate canoe angry enhance wrist vast kitten drift",
	seed: "3f50cac98260743db0e204ccd3f5c62ac9280ff5931285d2ddf71d97ba28cf8d42aace31eb01ad22a30ad3edb9b8dd43785a36cd9b18877717befa46f1e198c3",
	xprv: 'tprv8ZgxMBicQKsPdUHoRdNm795iJKPCtsgAQ5R2EFS6uFEoLZCWfg3E79oW9F6XJzDZVuyjJfaJWLT9NoHLPDeNWaFevxDoyG6zjpiJ3RqTsEf',
	xpub: 'tpubD6NzVbkrYhZ4WwKbKH3MWYjpsLu94Cs4yP1oWmUQKX3CB3THJ4rpHeRNKMddUS72H6vD4RCAubgNLwRhnc1TiVVF2cs4QMRQJgofk5FkbU7',
	derive: {
		path: "m/44'/1'/0'/0/0",
		pubkey: "02c94b05f03c96d83dcd369444b586dff225fcc3b04e5e9f99dd558295014d99b7",
		privkey: "f5cc48441b20eabee6d33da623e10e9638bd03e6081727d1aa4dbc7a288a4f2c",
	},
};

const customerKey = {
	mnemonic: "more slight spatial margin myself bind shrug wasp rule subject anxiety order",
	// master keys
	xpub: 'tpubD6NzVbkrYhZ4Xgf1Tj78YpSjnGZr6yJdz84ga4eGbTmzU5UyHSN7Nd1ehUqPb86K9xM2GDadYmx12PmwqpFXgSDhY8xnRSsD3GysFjYFSYQ',
	xprv: 'tprv8ZgxMBicQKsPeDdDa5SY9QndDF3uwe7jQpTuHYbyBBybdbECf3YXC8PnXM2YV3tknoQ8r5mHzBcErGmVFw5kdcupwAdSQHu9shEy6B6PeUA',
	deriveKeys: [
		{
			path: "m/44'/1'/0'",
			xpub: "tpubDCzM3jjrDAr8PkaDAjFYCFofaF9SSmHVEFrW7DiwcXYjtKYnkszC7AwW6qHDcFJ6vXhZGqSHaj7fnj9ZGVh3ZuH1tWBjWsbWyhUMEpZDEtx",
			xprv: "tprv8gJJuKhc4oATWHYRH5awnr9Z1DdWHS6aexFiphgeCFkM3qJ28VAbvgKdvhonjLtfGQhPoqHz3rcPBn8KJ81qY4nuSid8Grv2hwnTqJ2PGBZ",
		},
		{
			path: "m/44'/1'/0'/0/0",
			pubkey: "038e7432936e278686abe34f88937bd5dfdeaf3ed7cdad561bc019964d3e10fe93",
			privkey: "77ccf39b9298d5eb0520006867b741d313f109e4f25882c03c0c124955833bbc",
			WIF: "cRbaVn69WcudbL9WFEfzPGkbdQ4TkVSyNkb3a4zWPmG6hdNFo7aJ"
		},
	],
};

export {
	merchantKey,
	customerKey
}
