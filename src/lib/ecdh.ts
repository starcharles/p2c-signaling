import * as crypto from "crypto";

export class ECDH {
	constructor(private ecdh = crypto.createECDH("secp256k1")) { }

	public getPublicKeyBuffer(privateKey: string): Buffer {
		this.ecdh.setPrivateKey(privateKey, "hex");
		return this.ecdh.getPublicKey();
	}
	public getSharedPubkey(pubkey: Buffer, privkey: Buffer): string {
		this.ecdh.setPrivateKey(privkey);
		const secret = this.ecdh.computeSecret(pubkey);
		this.ecdh.setPrivateKey(secret);
		return this.ecdh.getPublicKey("hex", "compressed");
	}
}