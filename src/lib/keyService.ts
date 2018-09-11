import { ECPair, HDNode, networks, Network, crypto as bcrypto } from "bitcoinjs-lib";
import { ec as EC } from "elliptic";
import * as bip39 from "bip39";
import * as bs58check from "bs58check";
import * as crypto from "crypto";

export type XKeys = {
	xpub: string,
	xprv: string,
};

export class KeyService {
	private network: Network = networks.testnet;

	public static getAddressFromPubkey(pubkeyBuffer: Buffer, network: Network = networks.testnet): string {
		return ECPair.fromPublicKeyBuffer(pubkeyBuffer, network).getAddress();
	}

	public static deriveSignalAddress(merchantPubkey: string, ecdhSharedPubkey: string, network?: Network): string {
		if (!network) {
			network = networks.testnet;
		}
		const sha256 = crypto.createHash("sha256");
		const hash = sha256.update(ecdhSharedPubkey).digest();
		const ecdh = crypto.createECDH("secp256k1")
		ecdh.setPrivateKey(hash);
		const pub = ecdh.getPublicKey("hex");

		const ec = new EC("secp256k1");
		const key1 = ec.keyFromPublic(pub, "hex")
		const key2 = ec.keyFromPublic(merchantPubkey, "hex")
		const addedPubkey = key1.getPublic().add(key2.getPublic()).encode("hex");
		return this.getAddressFromPubkey(Buffer.from(addedPubkey, "hex"), network);
	}

	constructor(private keys: XKeys, options: any) {
		this.network = options.network ? options.network : networks.testnet;
	}

	public deriveP2CAddress(contractHash: string): string {
		// TODO: xpub should be bip175 style (m/175'/0'/...
		const paymentBase = this.keys.xpub;
		let hash: Buffer = bcrypto.sha256(Buffer.from(paymentBase + contractHash, "utf8"));

		const CHUNCK_LENGTH = 4;
		const chuncks = [];

		for (let i = 0; i < hash.length; i += CHUNCK_LENGTH) {
			let chunck = hash.slice(i, i + CHUNCK_LENGTH);
			chuncks.push(hexToInt(chunck))
		}
		// console.log(chuncks);

		const path = chuncks.join("/");
		console.log(path);

		const hd = HDNode.fromBase58(this.keys.xprv, this.network);
		const address = hd.derivePath(path).getAddress();

		console.log(address);

		return address;

		// TODO: private method
		function hexToInt(hexBuffer: Buffer): number {
			if (hexBuffer.length !== CHUNCK_LENGTH) throw new Error("Invalid Buffer Length.")
			let i = 11111
			return i;
		}
	}

	public derivePubkeyByChildPath(path: string): Buffer {
		const idx: string[] = path.split("/");
		if (idx.length !== 2) throw new Error("invalid path.");
		return HDNode.fromBase58(this.keys.xpub, this.network)
			.derive(parseInt(idx[0]))
			.derive(parseInt(idx[1]))
			.getPublicKeyBuffer();
	}

	public getKeypair(path: string) {
		const hd = this.derivePrivkey(path);
		return hd.keyPair;
	}

	public derivePrivkeyByChildPath(path: string): Buffer {
		const hd = this.derivePrivkey(path);
		// WIF to private key
		// https://en.bitcoin.it/wiki/Wallet_import_format
		return bs58check.decode(hd.keyPair.toWIF()).slice(1, -1);
	}

	public derivePubkeyFromMaster(derivePath: string): Buffer {
		const hd = HDNode.fromBase58(this.keys.xprv, this.network).derivePath(derivePath);
		return hd.getPublicKeyBuffer();
	}

	public derivePrivFromMaster(derivePath: string): Buffer {
		const hd = HDNode.fromBase58(this.keys.xprv, this.network).derivePath(derivePath);
		return bs58check.decode(hd.keyPair.toWIF()).slice(1, -1);
	}

	public generateMnemonic(): string {
		return bip39.generateMnemonic();
	}

	public mnemonicToExtendedKeys(mnemonic: string): XKeys {
		const seed = bip39.mnemonicToSeedHex(mnemonic);
		const hd = HDNode.fromSeedHex(seed, this.network);

		return {
			xprv: hd.toBase58(),
			xpub: hd.neutered().toBase58(),
		};
	}

	private derivePrivkey(path: string): HDNode {
		const idx: string[] = path.split("/");
		if (idx.length !== 2) throw new Error("invalid path");
		const hd = HDNode.fromBase58(this.keys.xprv, this.network)
			.derive(parseInt(idx[0]))
			.derive(parseInt(idx[1]));
		return hd;
	}
}
