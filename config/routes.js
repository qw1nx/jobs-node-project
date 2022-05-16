const authController = require('../controllers/auth');
const postsController = require('../controllers/posts');

module.exports = (app) => {
    app.use(postsController);
    app.use(authController);
}