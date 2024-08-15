const { sphincs } = require('sphincs');
const fs = require('fs').promises;
const path = require('path');

(async () => {

   // error response
   const errorResponse = (message, error) => {
    console.error(`Message: ${message}, Error: ${error ? error.toString() : 'N/A'}`);
  };

  // read file message
  const readMessageFile = async (filePath) => {
    try {
      const fileContent = await fs.readFile(filePath);
      return fileContent;
    } catch (err) {
      errorResponse('Failed to read message file', err);
      throw err; // Rethrow the error after logging it
    }
  };

  // Example usage
  const filePath = path.join(__dirname, 'message.txt');

  try {
    function stringToArray(bufferString) {
      let uint8Array = new TextEncoder("utf-8").encode(bufferString);
      return uint8Array;
    }

    function arrayToString(bufferValue) {
      return new TextDecoder("utf-8").decode(bufferValue);
    }
    const messageBytes = await readMessageFile(filePath);

    const message = messageBytes.toString();

    const messageArray = stringToArray(message);

    const keyPair = await sphincs.keyPair();

    // const message = new Uint8Array([104, 101, 108, 108, 111, 0]); // "hello"

    /* Combined signatures */
    const signed = await sphincs.sign(message, keyPair.privateKey);
    const verified = await sphincs.open(signed, keyPair.publicKey); // same as message

    /* Detached signatures */
    const signature = await sphincs.signDetached(message, keyPair.privateKey);
    const isValid = await sphincs.verifyDetached(signature, message, keyPair.publicKey); // true

    console.log("key pair:", keyPair);
    console.log("message:", messageBytes);
    console.log("signed: ", signed);
    console.log("verified:", verified);
    console.log("signature:", signature);
    console.log("valid:", isValid);
  } catch (err) {
    errorResponse('Failed to execute Sphincs operations', err);
  }
})();
