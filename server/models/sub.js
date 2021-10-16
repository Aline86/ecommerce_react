const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;
// trim pour supprimer les espaces dans les requêtes utilisateurs
const subSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Le nom est obligatoire',
        minLength: [2, 'Trop court'],
        maxLength: [32, 'Trop long']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true, 
        index: true,
    },
    parent: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
},
{ timestamps: true}
);

module.exports = mongoose.model('Sub', subSchema)