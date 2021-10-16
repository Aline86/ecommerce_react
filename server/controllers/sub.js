const Sub = require('../models/sub')
const slugify = require('slugify')
const Product = require('../models/product')
// s'il y a un pb il faut vérifier que la rep reçu du front est correcte et faire console.log(req.body)
exports.create = async (req, res) => {
    try {
        const {name, parent} = req.body
        const sub = await new Sub({
            name, parent, slug: slugify(name)
        })
        .save()
        res.json(sub)
    } catch (error) {
        console.log("SUB CREATE ERR ---------", error)
        res.status(400).send('Create subcategory failed')
    }
}

exports.list = async (req, res) => 
    res.json(await Sub.find({}).sort({createdAt: -1}).exec())

// Utiliser le même nom dans la route et dans le controller au niveau de la méthode
exports.read = async (req, res) => {
    let sub = await Sub.findOne({slug: req.params.slug}).exec();
    const products = await Product.find({subs: sub})
    .populate('category')
    .exec()
    res.json({
        sub,
        products
    })
  
}

exports.findSubsById = async (req, res) => {
    var parent = req.params.parent
    let subs = await Sub.find({
        parent: parent,
      }).sort({createdAt: -1}).exec();
   
    res.json(subs)
}
// possible d'utiliser findIdAndDelete mais avec slug il faut la méthode suivante
exports.update = async (req, res) => {
    console.log(req)
    const {name, parent} = req.body
    try {
        const updated = await Sub.findOneAndUpdate(
                {slug: req.params.slug}, 
                {name, slug: slugify(name), parent}, 
                {new: true}
            )
            res.json(updated)
    } catch (error) {
        res.status(400).send("Create update failed")
    }
    
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Sub.findOneAndDelete({
            slug: req.params.slug
        });
        res.json(deleted)
    } catch (error) {
        res.status(400).send('Subcategory category failed')
    }
}