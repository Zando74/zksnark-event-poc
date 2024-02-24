const { generateProof, makeLocalSnarkJsZkOperator, verifyProof } = require('@reclaimprotocol/circom-symmetric-crypto');

class Prover {
	constructor(key, iv) {
		this.key = key;
		this.iv = iv;
	}

	async proofThatEventExistInFlow(encrypted_hash_candidate) {
	if(!this.zkOperator) {
		this.zkOperator = await makeLocalSnarkJsZkOperator('chacha20');
	}

	const { proofJson, plaintext } = await generateProof(
		'chacha20',
		{
			key: this.key,
			iv: this.iv,
			offset: 0
		},
		{ ciphertext: encrypted_hash_candidate },
		this.zkOperator
	);

		return { proofJson, encrypted_hash_candidate, plaintext}
	}

	async generateFakeProof(encrypted_hash_candidate, fakePlainText) {
		if(!this.zkOperator) {
			this.zkOperator = await makeLocalSnarkJsZkOperator('chacha20');
		}
	
		const { proofJson, plaintext } = await generateProof(
			'chacha20',
			{
				key: this.key,
				iv: this.iv,
				offset: 0
			},
			{ ciphertext: encrypted_hash_candidate },
			this.zkOperator
		);
	
			return { proofJson, encrypted_hash_candidate, plaintext: fakePlainText}
	}
}

module.exports = Prover;