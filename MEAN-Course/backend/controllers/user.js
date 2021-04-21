const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const baseconfig = require('../baseConf');

const User = require("../models/user");


exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message: "User created!",
                result: result
            });
        }).catch(err => {
            res.status(500).json({
                message: "Invalid authentication credentials!"
            });
        });
    });
}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            baseconfig.jwtKey,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Invalid authentication credentials!"
        });
    });
}

exports.getUsers = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userQuery = User.find();
    let fetchedUsers;
    if (pageSize && currentPage) {
        userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    userQuery.then(documents => {
        documents.forEach(element => {
            element.password = bcrypt.decodeBase64(element.password);
        });
        fetchedUsers = documents;
        return User.estimatedDocumentCount();
    }).then(count => {
        res.status(200).json({
            message: "users fetched successfully!",
            users: fetchedUsers,
            maxUsers: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching users failed!"
        })
    });
}