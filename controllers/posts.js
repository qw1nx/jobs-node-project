const {isUser, isOwner} = require('../middleware/guards');
const mapErrors = require('../util/mappers');
const {createPost, getPosts, getPostById, updatePost, applyForPost} = require('../services/secondService')
const {getEmailById, listOfApplicants} = require("../services/userService");
const preload = require('../middleware/preload');
const {ObjectId} = require('mongodb');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const allPosts = await getPosts();

        const posts = [];

        for (let i = 0; i < 3; i++) {
            if (allPosts[i] !== undefined) {
                posts[i] = allPosts[i]
            }
        }

        posts.map(a => {
            a.applicantsNum = a.usersApplied.length;
        });

        res.render('home', {title: 'Home', posts})
    } catch (e) {
        console.log(e);
        res.redirect('/404');
    }
});


router.get('/create', isUser(), (req, res) => {
    res.render('create', {title: 'Create post'})
});

router.post('/create', isUser(), async (req, res) => {
    const post = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        author: req.session.user._id,
        usersApplied: []
    }

    try {
        await createPost(post);
        res.redirect('/catalog');
    } catch (err) {
        //TODO send error messages
        const errors = mapErrors(err);
        res.render('create', {post, errors});
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const posts = await getPosts();

        res.render('all-ads', {title: 'Gallery', posts});
    } catch (e) {
        console.log(e.message);
        res.redirect('/');
    }
});

router.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    const post = await getPostById(id);


    if (req.session.user && req.session.user._id === post.author.toString()) {
        post.isAuthor = true;
    } else {
        post.isAuthor = false;
    }

    if (req.session.user && post.usersApplied.map(user=>user.toString()).includes(req.session.user._id)) {
        post.hasApplied = true;
    } else {
        post.hasApplied = false;
        // userSearchHistory.users.includes(user) with userSearchHistory.users.map(user=>user.toString()).includes(user).
    }
    //console.log(post.usersApplied.includes(String(req.session.user._id)));

    post.applicantsNum = post.usersApplied.length;

    post.authorEmail = await getEmailById(post.author);

    const applicants = await listOfApplicants(post.usersApplied)
    if (post) {
        res.render('details', {title: `${post.title}`, post, applicants});
    } else {
        res.redirect('/404');
    }
});


router.get('/edit/:id', preload(), isOwner(), async (req, res) => {
    const id = req.params.id;
    const post = await getPostById(id);

    if (post) {
        console.log(post);
        res.render('edit', {post});
    } else {
        res.redirect('404');
    }

});

router.post('/edit/:id', preload(), isOwner(), async (req, res) => {
    const id = req.params.id;
    const post = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
    };
    try {
        await updatePost(id, post);
        res.redirect('/details/' + id);

    } catch (err) {
        //TODO send error messages
        const errors = mapErrors(err);
        res.render('edit', {post, errors});
    }


})

router.get('/apply/:id', preload(), isUser(),async (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user._id;
    try{
        await applyForPost(postId, userId);
        res.redirect('/details/' + postId);
    } catch (e){
        console.log(e.message)
        res.redirect('/details/' + postId);
    }
});

router.get('/delete/:id', preload(), isOwner(), async (req, res) => {
    try{
        await req.storage.deleteById(req.params.id);
        res.redirect('/catalog');
    } catch (e){
        console.log(e.message);
    }
});

module.exports = router;