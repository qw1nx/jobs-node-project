const { isUser, isGuest } = require('../middleware/guards');
const { register, login } = require('../services/userService');
const mapErrors = require('../util/mappers');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) =>{
    res.render('register')
});


//TODO check form action, method, field names
router.post('/register', isGuest(), async (req, res) => {
   
   try{
    if( req.body.password.trim() === ''){
        throw new Error('Password is required')
    }
    if( req.body.skills.trim() === ''){
        throw new Error('Skills are required')
    }
    if( req.body.password !== req.body.repass){
       throw new Error('Passwords don\'t match')
   }

  const user = await register(req.body.email, req.body.password, req.body.skills);

  req.session.user = user;
  res.redirect('/');
}catch(err){
    console.error(err);
    //TODO send error messages
    const errors = mapErrors(err);
    res.render('register', { data: {email: req.body.email, skills: req.body.skills }, errors });
}
});

router.get('/login', isGuest(), (req, res) =>{
    res.render('login', { data: {email: req.body.email} });
});


//TODO check form action, method, field names
router.post('/login', isGuest(), async (req, res) => {
    try{
        const user = await login(req.body.email, req.body.password);
        req.session.user = user;
        //console.log('this is in auth controller and is checking if session user is set', req.session.user);
        res.redirect('/') //TODO check redirect requirements
    }catch(err){
        console.error(err);
        //TODO send error messages
        const errors = mapErrors(err);
        res.render('login', {data: {email: req.body.email }, errors });
    }
});

router.get('/logout', isUser(), (req, res) =>{
    delete req.session.user;
    res.redirect('/')
});

module.exports = router;