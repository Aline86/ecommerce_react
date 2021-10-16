const mongoose = require('mongoose')
const {OjectId} = mongoose.Schema;
// index => true allows to query user by email - it is an index
// wishList => save productId in user's whishList
// timestamp => create createdDate and UpdatedDate in the DB automatically
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        default: "subscriber",
    },
    cart: {
        type: Array,
        default: []
    },
    address: String,
    // wishlist: [{type: ObjectId, ref: "Product"}],
    }, 
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);
