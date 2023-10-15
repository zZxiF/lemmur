const Sequelize = require('sequelize');
const { models } = require('../models');




exports.load = async (req, res, next, userId) => {
    try {
        const user = await models.User.findByPk(userId);
        if (user) {
            req.load = { ...req.load, user };
            
            next()
        }
        else {
            throw new Error('No existe el usuario' + userId)
        }

    } catch (error) {
        next(error);
    }

};


exports.index = async (req, res, next) => {
    try {
        const findOpt = {order: ['username'] };
        const users = await models.User.findAll(findOpt);

        res.render('users/index', {users});
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) =>{
    const {username, password, email} = req.body;

    let user = models.User.build({
        username,
        password,
        email
    });

    if (!password||!username||!email){
        console.log("Faltan campos");
        return res.render('users/new', {user});
    }

    try {
        const dis = await user.save()

        // if(req.session.loginUser){
        //     res.redirect('/users/'+ dis.id)
        //     // req.session.loginUser = { {fields: ["username", "pasword", "salt", "email"]}
        //     //     id: user.id,
        //     //     username: user.username
        //     //    // ,isAdmin: user.isAdmin,
        //     //     //expires: Date.now() + maxIdleTime
        //     // };
        //     // res.redirect("/");

        // }else{
        //     res.render('users/new', {user});
        //     console.log("Error: Usuario no encontrado");
        // }
    } catch (error) {
        console.log("Error");
        next(error);
    }
   
    res.render('users/show', { user });
};

exports.show = (req, res, next) => {
    const { user } = req.load;
    res.render('users/show', { user });
};


exports.new = async (req, res, next) => {
    const user = {
        username: "",
        password: "",
        email: ""
    };
    res.render('users/new', { user });
};


exports.edit = (req, res, next) => {
    const { user } = req.load;
    res.render('users/edit', {user});
};

exports.update = async (req, res, next) => {
    const { user } = req.load;
    const {username, password, email} = req.body;
    console.log(user);
    user.username=username;
    user.password=password;
    user.email=email;

    

 

    try {
        console.log('eyyyyyyyyyyyyyyyy');
        await req.load.user.save();
        res.redirect('/users/' + user.id);
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            req.flash('error', 'There are errors in the form:');
            error.errors.forEach(({message}) => req.flash('error', message));
            res.render('users/edit', {user});
        } else {
            next(error);
        }
    } 
/*
    const {username, password, email} = req.body;

    const user = await models.User.findByPk(req.load.userId)

    if (!password||!username||!email){
        console.log("Faltan campos");
        return res.render('users/new', {user});
    }
    user.username=username;
    user.password=password;
    user.email=email;


    try {
        await user.save();
        res.redirect('/users/' + user.id);
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            req.flash('error', 'There are errors in the form:');
            error.errors.forEach(({message}) => req.flash('error', message));
            res.render('users/edit', {user});
        } else {
            next(error);
            console.log(error);
        }
    } */


};




exports.destroy = async (req, res, next)=>{
    try {
        if (req.session.loginUser?.id === req.load.user.id){
            delete req.session.loginUser;
        }
        await req.load.user.destroy();
        res.redirect('/users');
    } catch (error) {
        next(error);
    }
};



