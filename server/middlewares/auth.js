const admin = require('../firebase')
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
  // console.log("token " + req.headers.authtoken); // token
  try {
      console.log("header token" + req.headers.authtoken)
      const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken)
        console.log('FIREBASE USER IN AUTHCHECK', firebaseUser)
        // Pour faire passer des infos, on les fait passer dans la req
        req.user = firebaseUser;
        next();
  } catch (err) {
      res.status(401).json({
          err: "Invalid or expired token",
      })
  }
  //  next();
}
// Quand le code cette function sera exécuté, il y aura déjà le user et ses infos récupérés dans firebase
exports.adminCheck = async (req, res, next) => {
  const{email} = req.user

  const adminUser = await User.findOne({email}).exec()
  
  if(adminUser.role !== 'admin'){
    res.status(403).json({
      err: 'Admin resource. Access denied.'
    })
  } else {
    next()
  }
  
}