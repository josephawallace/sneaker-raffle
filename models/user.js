var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    address: { type: String, required: true, unique: true },
    email: { type: String, },
    phone: { type: String },
    shippingAddress: { tyype: String },
});

module.exports = mongoose.model('User', UserSchema);