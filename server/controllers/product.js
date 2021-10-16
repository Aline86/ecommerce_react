const Product = require('../models/product')
const slugify = require('slugify')
const User = require("../models/user")

exports.create = async(req, res) => {
    try {
        console.log("product create " + req.body.title);
        req.body.slug = slugify(req.body.title);
        // Possible to save everything in one line
        const newProduct = await new Product(req.body).save()
        console.log(newProduct)
        res.json(newProduct);
    } catch (err) {
        console.log(err)
        res.status(400).json({
            err: err.message,
        })
    }
}

// to be able to populate, you need to have reference in the model in the entries
// populate refers to the entire model ref so you get all the info
exports.listAll = async(req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']])
    .exec()
    res.json(products)
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deleted)
    } catch (err) {
        console.log(err)
        return res.status(400).send('Product delete failed')
    }
}

exports.read = async (req, res) => {
    const product =  await Product.findOne({slug: req.params.slug})
    .populate('category')
    .populate("subs")
    .exec();
    res.json(product)

}
exports.update = async(req, res) => {
    try {
        if(req.body.title)
        {
            req.body.slug = slugify(req.body.title)
        }        
        const updated = await Product.findOneAndUpdate(
            {slug: req.params.slug},
            req.body,
            // to send updated data as a response otherwise we receive old data
            {new: true}
        );
        res.json(updated).exec()
        
    } catch (err) {
        console.log('PRODUCT UPDATE ERRORO ---> ', err)
        res.status(400).json({
            err: err.message,
        })
    }
}

/* WITHOUT PAGINATION
exports.list = async(req, res) => {
    try {
        const {sort, order, limit} = req.body
        const products = await Product.find({})
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(limit)
        .exec()

        res.json(products)
    } catch (err) {
        console.log(err)
    }
}*/

exports.productsCount = async(req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec()
    res.json(total)
}
// WITH PAGINATION
exports.list = async(req, res) => {
    try {
        const {sort, order, page} = req.body
        const currentPage = page || 1
        const perPage = 3

        const products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(perPage)
        .exec()

        res.json(products)
    } catch (err) {
        console.log(err)
    }
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({email: req.user.email}).exec()
    const {star} = req.body
    // who is updating ?
    // check if currently logged in user have already added rating to this product ?
    // find is a sort of filter method
    let existingRatingObject = product.ratings.find(
        (ele) => (ele.postedBy.toString() === user._id.toString())
    );
        console.log(" existingRatingObject " +  existingRatingObject)
    // if user hasen't left rating yet, push it
    if(existingRatingObject === undefined)
    {
       
        const ratingAdded = await Product.findByIdAndUpdate(product._id, {
            // $push to push an object in mongoose
            $push: { 
                ratings: {star, postedBy: user._id} 
                },
            // new: true to send the newly updated to the front end 
            // otherwise the previous information is sent to the front end
            }, { new: true }
        ).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    }else{
        const ratingUpdated = await Product.updateOne(
            {
                ratings: {
                    $elemMatch: existingRatingObject
            }
            // syntaxe to update only the star
        }, {$set: { "ratings.$.star": star}},
        {new: true}
        ).exec()
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
    // if user has allready left rating, updtae it
}

exports.listRelated = async(req, res) => {
    const product =  await Product.findById(req.params.productId).exec();
    console.log(product)
    // $ne => not included => Product not included but products wit product_category
    // '-password' with postedBy to not send certain properties
    const related = await Product.find({
        _id: {$ne: product._id},
        category: product.category
    })
    .limit(3)
    .populate('category')
    .populate('subs')
    .exec()

    res.json(related)
}

const handlePrice = async(req, res, price) => {
    try {
        let products = await Product.find({
            // $gte => greater than / $lte => less than
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
        .populate("category")
        .populate("subs")
        .exec();
        res.json(products)
    } catch (error) {
        console.log("error " + error)
    }
}

const handleQuery = (req, res, query) => {
    // find the product based on the text in description // $search est equivalent à like 
    console.log("query "  + query)
    Product.find(
        {
            $or: [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }]
        },
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            console.log("products ", result)
            res.json(result)
            
        }).populate("category").populate("subs")
}

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({category})
            .populate("category")
            .populate("subs")
            .limit(12)
            .exec();
        res.json(products)
    } catch (error) {
        console.log(error)
    }
}
// $$ROOT is a method that gives access to the entire product document
// otherwise prossibility to get all the fields like: title: "$title", description: "$description" but it is very fastidious
// 3.33 => ceiling => 4 //// floor => 3
// match allows to check if Product average rating matches with incoming star value
// exec() only if you don't use async / await
const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                floorAverage: {
                    $floor: {
                        $avg: "$ratings.star"
                    },
                },
            },
        },
        {
            $match: {
                floorAverage: stars
            }
        }
    ])
    .limit(12)
    .exec((err, aggregates) => { // aggregates is the result of Products matching star value requirements
        // Is used to populate matching products
        if(err) console.log("AGGREGATE ERROR", err)
        Product.find({_id:aggregates})
        .populate("category")
        .populate("subs")
        .limit(12)
        .exec((err, products) => {
            if(err) console.log("PRODUCT AGGREGATE ERROR", err)
            res.json(products)
        });
    })
};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({subs: sub})
        .populate("category")
        .populate("subs")
        .exec();
    res.json(products)

}

// SHIPPING / COLOR AND BRAND
const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({shipping})
        .populate("category")
        .populate("subs")
        .exec();
    res.json(products)
}
const handleColor = async (req, res, color) => {
    const products = await Product.find({color})
        .populate("category")
        .populate("subs")
        .exec();
    res.json(products)
}
const handleBrand = async (req, res, brand) => {
    const products = await Product.find({brand})
        .populate("category")
        .populate("subs")
        .exec();
    res.json(products)
}
// SEARCH / FILTER
exports.searchFilter = (req, res) => {
 
    const {query, price, category, stars, sub, shipping, color, brand} = req.body
    if(query){
        
        handleQuery(req, res, query)
    }

    if(price !== undefined){
        console.log('price --->', price)
        handlePrice(req, res, price)
    }

    if(category){
        console.log("category ------> ", category);
        const products = handleCategory(req, res, category) 
    }
    if(stars){
        console.log("stars ------>", stars)
        handleStar(req, res, stars)
    }
    if(sub){
        console.log("sub --->", sub)
        handleSub(res, res, sub)
    }
    if(shipping){
        console.log("shipping ----> ", shipping)
        handleShipping(req, res, shipping)
    }
    if(color){
        console.log("color ----> ", color)
        handleColor(req, res, color)
    }
    if(brand){
        console.log("brand ----> ", brand)
        handleBrand(req, res, brand)
    }
    
}