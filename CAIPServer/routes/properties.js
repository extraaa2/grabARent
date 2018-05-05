var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');
var md5     = require('md5');
var config  = require('../config.json');
var async   = require('async');

var connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});

connection.connect();

/* POST new property. */
router.post('/', function(req, res, next) {
    var query = {
        idusers: req.body.idusers,
        neighbourhood: req.body.neighbourhood.toString(),
        gps_lat: req.body.gps_lat,
        gps_long: req.body.gps_long,
        floor: req.body.floor,
        maxfloor: req.body.maxfloor,
        rooms: req.body.rooms,
        comfort: req.body.comfort.toString(),
        address: JSON.stringify(req.body.address),
        price: req.body.price
    };
    connection.query("INSERT INTO properties SET ?", query, function(error, results, fields) {
        if(error) {
            console.log(error);
            res.send({
                error: "A problem occurred."
            });
            return;
        }
        var idproperties = results.insertId;
        async.each(req.body.pictures, function (picture, cb) {
            var query = {
                idproperties: idproperties,
                picture: picture
            };
            connection.query("INSERT INTO pictures SET ?", query, function(error, results, fields) {
                if (error) {
                    cb(error);
                    return;
                }
                cb();
            });
        }, function (error) {
            if (error) {
                console.log(error);
                res.send({
                    error: "A problem occured."
                });
                return;
            }
            res.send({
                message: "Property added."
            });
        });

    });
});

/* GET property details */
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

/* POST update property details */
router.post('/([a-zA-Z0-9]+)', function(req, res, next) {
    var id = req.path.split('/')[1];
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
