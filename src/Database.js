var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

con.connect();

function getCalories(date){
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT diet.calories FROM diet INNER JOIN user ON diet.user_id = user.id WHERE user.username = 'gipsz_jakab'", function (err, result, fields) {
          if (err) throw err;
          return result;
        });
      });
}