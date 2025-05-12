const CryptoJS = require("crypto-js")
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, process.env.JWT_SECRET).toString();
};
const decryptData = (encryptedToken) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.JWT_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptData, decryptData }
        