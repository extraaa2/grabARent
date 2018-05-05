var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');
var md5     = require('md5');
var config  = require('config.json');

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

/* GET user details */
router.get('/([a-zA-Z0-9]+)', function (req, res, next) {
    var id = req.path.split('/')[1];
    var query = 'SELECT * from `users` WHERE `idusers` = "' + id + '"';
    connection.query(query, function (error, results, fields) {
        if (error){
            console.log(error);
            res.send({
                error: "User not found."
            });
            return;
        }
        var response = {
            id: results[0].idusers,
            firstName: results[0].firstName,
            lastName: results[0].lastName,
            rank: results[0].rank,
            profilePicture: results[0].picture,
            telephone: results[0].telephone
        };
        var query = 'SELECT COUNT(*) AS count FROM properties WHERE idusers = "' + id + '"';
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

router.post('/([a-zA-Z0-9]+)', function(req, res, next) {
    var id = req.path.split('/')[1];
    var updates = [];
    var query = 'UPDATE users SET ';
    for (var key in req.body) {
        query += key + " = ?, ";
        updates.push(req.body[key]);
    }
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    updates.push(id);

    console.log(query);
    console.log(updates);

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

module.exports = router;
