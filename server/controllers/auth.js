const User = require('./../models/user')
exports.createOrUpdateUser = async (req, res) => {
    const {name, picture, email} = req.user;
    console.log("name " + name)
    const user = await User.findOneAndUpdate({email}, {name: email.split('@')[0], picture}, {new: true})
    if(user){
        res.json(user)
    }
    else
    {
        const newUser = new User()
        newUser.email = email
        newUser.name = email.split('@')[0]
        newUser.picture = picture
        newUser.save(newUser) 
    }
}

exports.currentUser = async (req, res) => {
    User.findOne({email: req.user.email}).exec((err, user) => {
        if(err) throw new Error(err)
        res.json(user);
    })
}