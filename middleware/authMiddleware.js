const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireauth = (req, res, next) => {
    const token = req.cookies.JWT;

    //check JWT existance & validity
    if (token){
        jwt.verify(token, 'Secret', (err, decodedToken) => {   // Secret should be replaced with your secret
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            }else {
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }

}


const checkuser =  (req, res, next) => {
    const token = req.cookies.JWT;

    //check JWT existance & validity
    if (token){
        jwt.verify(token, 'Secret', async (err, decodedToken) => {   // Secret should be replaced with your secret
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next()
;    }

}



module.exports = { requireauth, checkuser };