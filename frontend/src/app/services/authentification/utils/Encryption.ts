import { Injectable } from '@angular/core';
import crypto from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class Encryption {
    static textToHash = 'ALL@MYM@-**AAAA';

    static bytes = crypto.enc.Utf8.parse(Encryption.textToHash);
    static sha512Result = crypto.SHA512(Encryption.bytes);

    static hashedText = Encryption.sha512Result.toString();

    static keyBytes = crypto.SHA512(Encryption.hashedText.substring(0, 16)).toString(crypto.enc.Hex);
    static key = crypto.enc.Hex.parse(Encryption.keyBytes.substring(0, 32));
    static iv = crypto.enc.Hex.parse(Encryption.keyBytes.substring(32, 64));

    static encryptText(plainText: string): string {
        try {
            const encrypted = crypto.AES.encrypt(plainText, Encryption.key, { iv: Encryption.iv });
            return encrypted.toString();
        } catch (e) {
            return '';
        }
    }

    static decryptText(ciphertext: string): string {
        try {
            const decrypted = crypto.AES.decrypt(ciphertext, Encryption.key, { iv: Encryption.iv });
            return decrypted.toString(crypto.enc.Utf8);
        } catch (e) {
            return '';
        }
    }
}
