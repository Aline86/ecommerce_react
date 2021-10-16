const mongoose = require('mongoose')

// trim pour supprimer les espaces dans les requêtes utilisateurs
const categorySchema = new mongoose.Schema({
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
},
{ timestamps: true}
);

module.exports = mongoose.model('Category', categorySchema)