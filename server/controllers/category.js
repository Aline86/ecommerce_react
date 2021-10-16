const Category = require('../models/category')
const Sub = require('../models/sub')
const slugify = require('slugify')
const Product = require('../models/product')
// s'il y a un pb il faut vérifier que la rep reçu du front est correcte et faire console.log(req.body)
exports.create = async (req, res) => {
    try {
        
        const {name} = req.body
        // equivalent to const name = req.body.name
        console.log("req body " + name)
        const category = await new Category({
            name, slug: slugify(name)
        })
        .save()
        res.json(category)
    } catch (error) {
        console.log(error)
        res.status(400).send('Create category failed')
    }
}

exports.list = async (req, res) => 
    res.json(await Category.find({}).sort({createdAt: -1}).exec())

// Utiliser le même nom dans la route et dans le controller au niveau de la méthode
exports.read = async (req, res) => {
    let category = await Category.findOne({slug: req.params.slug}).exec();

    //res.json(category)
    // find products based on this category
    const products = await Product.find({category: category})
    .populate('category')
    .exec()
    res.json({
        category,
        products
    })
}
// possible d'utiliser findIdAndDelete mais avec slug il faut la méthode suivante
exports.update = async (req, res) => {
    console.log(req.body.name)
    const {name} = req.body
    try {
        const updated = await Category.findOneAndUpdate(
                {slug: req.params.slug}, 
                {name, slug: slugify(name)}, 
                {new: true}
            )
            res.json(updated)
    } catch (error) {
        res.status(400).send("Create update failed")
    }
    
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({
            slug: req.params.slug
        });
        res.json(deleted)
    } catch (error) {
        res.status(400).send('Create category failed')
    }
}

exports.getSubs = (req, res) => {
    Sub.find({parent: req.params._id}).exec((err, subs) => {
     
        if(err) console.log(err);
        res.json(subs);
    })
 

}