import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { verifyProof, makeLocalSnarkJsZkOperator, ZKOperator, makeRemoteSnarkJsZkOperator } from '@reclaimprotocol/circom-symmetric-crypto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'verifier-app';
  zkOperator: ZKOperator | undefined = undefined;
  formData = {
    currency: '',
    emitter: '',
    receiver: '',
    amount: ''
  };
  isSendingRequest = false;
  submissions: any[] = [];

  emitterOptions = ['Jessim', 'Loïc', 'Nasri', 'Marc'];
  receiverOptions = ['Loïc', 'Jessim', 'Nasri', 'Marc'];
  currencyOptions = ['USD', 'EUR', 'JPY', 'GBP', 'AUD'];

  async verifyProofThatEventExistInFlow(proofJson : any, plaintext : any, encrypted_hash_candidate: any) {
    const zkOperator = await makeRemoteSnarkJsZkOperator({zkeyUrl: '../assets/circuit_final.zkey', circuitWasmUrl: '../assets/circuit.wasm'});

    const plaintextToUint8Array = new Uint8Array(Object.values(plaintext));
    const ciphertextToUint8Array = new Uint8Array(Object.values(encrypted_hash_candidate));

    try{
      await verifyProof(
        { proofJson, plaintext: plaintextToUint8Array, algorithm: 'chacha20' },
        { ciphertext: ciphertextToUint8Array },
        zkOperator
      )
    }catch(error){
      console.log(error);
      return false;
    }


    if((await this.isExistingTransactionInBlockchain(ciphertextToUint8Array))){
      return true;
    }

    return false;   
	}

  async isExistingTransactionInBlockchain(SHA256OfEncryptedEvent : Uint8Array) : Promise<boolean> {
    const response = await fetch('http://localhost:3333/transaction-by-encrypted-hash',{ 
      method: 'POST',
      headers: {
      "Content-Type": "application/json",
      }, 
      body: JSON.stringify({ SHA256OfEncryptedEvent: Array.from(SHA256OfEncryptedEvent)
        .map((i) => i.toString(16).padStart(2, '0'))
        .join('') }) 
    });
    const transaction = await response.json();
    return transaction !== undefined;
  }


  async submitForm() {
    this.isSendingRequest = true;
    const response = await fetch('http://localhost:3334/proof', { 
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ candidateEvent: {
        currency: this.formData.currency,
        emitter: this.formData.emitter,
        receiver: this.formData.receiver,
        amount: this.formData.amount
      }})
    });

    let proofStatus = "rejected";

    const jsonResponse = await response.json();
    if(jsonResponse.existing){
      console.log(jsonResponse)
      if(await this.verifyProofThatEventExistInFlow(jsonResponse.proverResponse.proofJson, jsonResponse.proverResponse.plaintext, jsonResponse.proverResponse.encrypted_hash_candidate)) {
        proofStatus = "accepted";
      }
    }
    

    this.submissions.push({...this.formData, proofStatus});
    this.isSendingRequest = false;
    
  }


}
