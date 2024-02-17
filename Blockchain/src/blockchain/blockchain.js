class Blockchain {
  static transactions = [];

  static pushEncryptedEvent(date, encryptedEvent, SHA256OfEventEncrypted, uniqueIvEncrypted) {
    this.transactions.push({
      date, encryptedEvent, SHA256OfEventEncrypted, uniqueIvEncrypted
    });
  }

  static getAll() {
    return this.transactions;
  }

  static findTransaction(encrypted_event) {
    return this.transactions.find( tx => tx.encryptedEvent === encrypted_event);
  }

  static findTransactionByEncryptedSHA256OfEvent(encryptedSHA256OfEvent) {
    return this.transactions.find( tx => tx.SHA256OfEventEncrypted === encryptedSHA256OfEvent);
  }
}

module.exports = Blockchain;