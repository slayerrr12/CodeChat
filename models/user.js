const mongoose = require('mongoose')
const crypto = require('crypto')





const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Username must be at least three characters long"]
        , unique: true
    }
    ,
    email: {
        type: String,
        unique: true,
        required: true
    }

    ,
    hash: String,
    salt: String
});
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
}

userSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'shal').toString('hex')
    return this.hash === hash;
}

module.exports = mongoose.model('User', userSchema);
