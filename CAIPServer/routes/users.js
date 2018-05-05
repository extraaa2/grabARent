var express = require('express');
var router = express.Router();
var mysql   = require('mysql');
var md5     = require('md5');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ella',
    password : 'Buttered2@',
    database : 'grabARent'
});

connection.connect();

/* GET users listing. */
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
router.get('/([0-9]+)', function (req, res, next) {
    var id = req.path().split('/');
    var query = "SELECT * from users WHERE idusers=" + id;
    connection.query(query, function (error, results, fields) {
        if (error){
            res.send({
                error: "User not found."
            });
            return;
        }
        console.log(results);
        console.log(fields);
        res.send({
            id: "",
            firstName: "John",
            lastName: "Smith",
            rank: 1,
            announces : 5,
            profilePicture: "0101",
            telephone: "+40712345678"
        });
    });

});

module.exports = router;
