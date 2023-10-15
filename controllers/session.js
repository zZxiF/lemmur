const Sequelize = require('sequelize');
const { models } = require('./models');
const url = require('url');
const { nextTick } = require('process');

const maxIdleTime = 5 * 60 * 1000;

 exports.deleteExpiredUserSession = (req, res, next) => {
    if (req.session.loginUser) {
        if (req.session.loginUser.expires < Date.now()) {
           delete req.session.loginUser;
         console.log('La sesión ha expirado');
        } else {
           req.session.loginUser.expires = Date.now() + maxIdleTime;
        }
    }
    next();
};

const authenticate = async (username, password) => {
    const user = await models.User.findOne({ where: { username } });
   return user?.verifyPassword(password) ? user : null;
};

exports.destroy = async (req, res, next) => {
    delete req.session.loginUser;
    res.redirect("/login");
};

 exports.new = async (req, res, next) => {
    res.render('session/new');
};

exports.create = async (req, res, next) => {

    const username = req.body.username ?? "";
    const password = req.body.password ?? "";

    try {
        const user = await authenticate(username, password);


        if (user) {

            req.session.loginUser = {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
                expires: Date.now() + maxIdleTime
            };
            res.redirect("/");

        } else {
            console.log("Error: La autenticación ha fallado");
            res.render('session/new');
        }
    } catch (error) {
        console.log("Error");
        next(error);
    }
};

exports.adminOrAuthorRequired = (req, res, next) => {
    const isAdmin = !!req.session.loginUser.isAdmin;
    const isAuthor = req.load.post.authorId === req.session.loginUser.id;
    if (isAdmin || isAuthor) {
        next();
    } else {
        res.redirect('/login');}};

exports.adminOrMyselfRequired = (req, res, next) => {
    const isAdmin = !!req.session.loginUser.isAdmin;
    const isMyself = req.load.user.id === req.session.loginUser.id;
    if (isAdmin || isMyself) {
        next();
    } else {
        res.redirect('/login');}};

exports.loginRequired = function (req, res, next) {
    if (req.session.loginUser) {
        next();
    } else {
        res.redirect('/login');}};

exports.adminRequired = (req, res, next) => {
    const isAdmin = req.session.loginUser.isAdmin;
    if (isAdmin) {
        next();
    } else {
    res.redirect('/login');}
};