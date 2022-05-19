const User = require('../models/User')
const jwt = require('jsonwebtoken');



const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors =  {email: '', password: ''};
    

    //  incorrect email in login
    if(err.message === 'incorrect email'){
        errors.email = 'Email you provided is not registered!';
    }
    
    //  incorrect password in login
    if(err.message === 'incorrect password'){
        errors.password = 'Password is incorrect';
    }

    // duplicate error code
    if(err.code === 11000){
        errors.email = 'That email is already registered';
        return errors;
    }
    
    // validate errors
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// create JWT
const maxAge = 60*60*24; // 1 day in sec
const createToken = (id) => {
    return jwt.sign({id}, 'temp secret', {              // Secret should be replaced with your secret
        expiresIn : maxAge
    });
};


module.exports.signup_get = (req, res ) => {
    res.render('signup');
}

module.exports.login_get = ( req, res ) => {
    
    res.render('login');
}

module.exports.signup_post = async ( req, res ) => {
    const {email, password} = req.body;
    
    try{
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('JWT', token, {httpOnly : true, maxAge : maxAge * 1000}); // 1 day in milisec
        res.status(201).json({user: user._id});
    }catch(err){
        
        // console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({errors});

    }
}

module.exports.login_post = async ( req, res ) => {
    const {email, password} = req.body;

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('JWT', token, {httpOnly : true, maxAge : maxAge * 1000}); // 1 day in milisec
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('JWT', '', {maxAge : 1});
    res.redirect('/');
}

