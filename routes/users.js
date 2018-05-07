var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');
var md5     = require('md5');
var async   = require('async');
var config  = require('../config.json');

var connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});

connection.connect();

/* POST new user. */
router.post('/', function(req, res, next) {
    var query = {
        idusers: md5(req.body.username),
        firstName: req.body.firstName.toString(),
        lastName: req.body.lastName.toString(),
        username: req.body.username.toString(),
        password: req.body.password.toString(),
        picture: req.body.profilePicture.toString(),
        city: req.body.city.toString(),
        telephone: req.body.telephone.toString()
    };
    connection.query("INSERT INTO users SET ?", query, function(error, results, fields) {
        if(error) {
            console.log(error);
            res.send({
                error: "A problem occurred."
            });
            return;
        }

        res.send({
            message: "User added."
        });
    });

});

/* GET all users details */
router.get('/', function (req, res, next) {
    var query = 'SELECT * from `users` ';
    connection.query(query, function (error, results, fields) {
        if (error){
            console.log(error);
            res.send({
                error: "Error while searching."
            });
            return;
        }
        var response = [];
        async.each(response, function (user, callback) {
            var send = {
                idusers: user.idusers,
                firstName: user.firstName,
                lastName: user.lastName,
                rank: user.rank,
                profilePicture: user.picture,
                telephone: user.telephone
            };
            var query = 'SELECT COUNT(*) AS count FROM properties WHERE idusers = "' + user.idusers + '"';
            connection.query(query, function (error, results, fields) {
                if (error){
                    console.log(error);
                    callback({
                        error: "User not found."
                    });
                    return;
                }
                send.announces =  results[0].count;
                response.push(send);
                callback();
            });

        }, function (error) {
            if (error){
                console.log(error);
            }
            res.send(response);
        })
    });

});

/* GET user details */
router.get('/([a-zA-Z0-9]+)', function (req, res, next) {
    var idusers = req.path.split('/')[1];
    var query = 'SELECT * from `users` WHERE `idusers` = "' + idusers + '"';
    connection.query(query, function (error, results, fields) {
        if (error){
            console.log(error);
            res.send({
                error: "User not found."
            });
            return;
        }
        var response = {
            idusers: results[0].idusers,
            firstName: results[0].firstName,
            lastName: results[0].lastName,
            rank: results[0].rank,
            profilePicture: results[0].picture,
            telephone: results[0].telephone
        };
        var query = 'SELECT COUNT(*) AS count FROM properties WHERE idusers = "' + idusers + '"';
        connection.query(query, function (error, results, fields) {
            if (error){
                console.log(error);
                res.send({
                    error: "User not found."
                });
                return;
            }
            response.announces =  results[0].count
            res.send(response);
        });
    });

});

/* POST update user details */
router.post('/([a-zA-Z0-9]+)', function(req, res, next) {
    var idusers = req.path.split('/')[1];
    var updates = [];
    var query = 'UPDATE users SET ';
    for (var key in req.body) {
        if (key !== 'username' && key !== 'idusers') {
            query += key + " = ?, ";
            updates.push(req.body[key]);
        }
    }
    query = query.slice(0, -2);
    query += " WHERE idusers = ?";
    updates.push(idusers);

    connection.query(query, updates, function(error, results, fields) {
        if(error) {
            console.log(error);
            res.send({
                error: "A problem occurred."
            });
            return;
        }

        res.send({
            message: "User updated."
        });
    });

});

/* DELETE a user */
router.delete('/([a-zA-Z0-9]+)', function(req, res, next) {
    var idusers = req.path.split('/')[1];

    connection.query('DELETE FROM posts WHERE idusers = "' + idusers + '"', function(error, results, fields) {
        if(error) {
            console.log(error);
            res.send({
                error: "A problem occurred."
            });
            return;
        }

        res.send({
            message: "User removed."
        });
    });

});

module.exports = router;
