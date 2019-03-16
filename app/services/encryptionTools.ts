const crypto2 = require("crypto");
class EncryptionTools {
  genRandomString = (length: number) => {
    return crypto2
      .randomBytes(Math.ceil(length / 2))
      .toString("hex") /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  };
  sha512 = (password: string, salt: string) => {
    let hash = crypto2.createHmac(
      "sha512",
      salt
    ); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest("hex");
    return {
      salt: salt,
      passwordHash: value
    };
  };
  saltHashPassword = (userpassword: string, userSalt?: string) => {
    if (!userSalt) {
      let salt = this.genRandomString(16); /** Gives us salt of length 16 */
      let passwordData = this.sha512(userpassword, salt);
      return passwordData;
    } else {
      let passwordData = this.sha512(userpassword, userSalt);
      return passwordData;
    }
  };
}
module.exports = EncryptionTools;
