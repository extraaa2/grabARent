var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');
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
        price: req.body.price,
        city: req.body.city
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
    var query = 'SELECT * from `properties` WHERE `idproperties` = "' + id + '"';
    connection.query(query, function (error, results, fields) {
        if (error){
            console.log(error);
            res.send({
                error: "Property not found."
            });
            return;
        }
        var response = {
            idusers: results[0].idusers,
            neighbourhood: results[0].neighbourhood,
            gps_lat: results[0].gps_lat,
            gps_long: results[0].gps_long,
            floor: results[0].floor,
            price: results[0].price,
            rooms: results[0].rooms,
            comfort: results[0].comfort,
            address: JSON.parse(results[0].address),
            maxfloor: results[0].maxfloor,
            city: results[0].city,
            pictures: []
        };
        var query = 'SELECT * FROM pictures WHERE idproperties = "' + id + '"';
        connection.query(query, function (error, results, fields) {
            if (error){
                console.log(error);
                res.send({
                    error: "Property not found."
                });
                return;
            }
            for (var i in results) {
                response.pictures.push(results[i].picture);
            }
            res.send(response);
        });
    });

});

/* POST update property details */
router.post('/([a-zA-Z0-9]+)', function(req, res, next) {
    var id = req.path.split('/')[1];
    var updates = [];
    var query = 'UPDATE properties SET ';
    for (var key in req.body) {
        if (key !== 'pictures' && key !== 'idproperties') {
            query += key + " = ?, ";
            updates.push(req.body[key]);
        }
    }
    query = query.slice(0, -2);
    query += " WHERE idproperties = ?";
    updates.push(id);

    connection.query(query, updates, function(error, results, fields) {
        if(error) {
            console.log(error);
            res.send({
                error: "A problem occurred."
            });
            return;
        }
        if (req.body.pictures) {
            async.each(req.body.pictures, function (picture, cb) {
                var query = {
                    idproperties: id,
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
                    message: "Property updated."
                });
            });
        }
    });

});

/* POST get filtered properties */

router.get('/filter', function (req, res, next) {
    var updates = [];
    var query = 'SELECT * FROM properties WHERE ';
    for (var key in req.body) {
        query += key + " = ?, ";
        updates.push(req.body[key]);
    }
    query = query.slice(0, -2);
    connection.query(query, updates, function(error, results, fields) {
        console.log(results);
    });
});

module.exports = router;