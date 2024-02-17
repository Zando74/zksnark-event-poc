const JSChaCha20 = require("js-chacha20");

class Chacha20Wrapper {
  constructor(key, iv) {
    this.key = key
    this.iv = iv
  }

  encrypt(plaintext) {
    const encodedPlainText = new TextEncoder().encode(plaintext);
    return new JSChaCha20(this.key, this.iv, 1).encrypt(encodedPlainText);
  }

  encryptWithCustomIV(plaintext, IV) {
    const encodedPlainText = new TextEncoder().encode(plaintext);
    return new JSChaCha20(this.key, IV, 1).encrypt(encodedPlainText);
  }

  decryptWithCustomIV(ciphertext, IV) {
    const encodedPlainText = new JSChaCha20(this.key, IV, 1).decrypt(ciphertext);
    return new TextDecoder().decode(encodedPlainText);
  }

  decrypt(ciphertext) {
    const encodedPlainText = new JSChaCha20(this.key, this.iv, 1).decrypt(ciphertext);
    return new TextDecoder().decode(encodedPlainText);
  }
}

module.exports = Chacha20Wrapper;