const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');

app.use(session({
    secret: 'secret-key',
    cookie:{maxAge: 15*60*1000},
	  resave: true,
	  rolling:true,
	  saveUninitialized:true
}))

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo"
});

con.connect(function(err) {
  if (err) throw err;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(9001, function () {
    console.log('Node app is running on port 9001');
});

app.post('/login', function(req,res){

	var param= [req.body.username,req.body.password]
	    con.query('select username from users where username=? and password=?',param,function(err, rows){

		    if(err)
		 	      con.end();
		    else if (!err && rows.length>0){
  		 	   req.session.username=req.body.username;
           console.log(" Session name " +req.session.username);
  		 	   res.json({'message':'Welcome '+rows[0].username});
		    }
		    else
		 	     res.json({'message':'There seems to be an issue with the username/password combination that you entered'});
	    });

});

app.post('/logout',function(req,res){
	if(req.session.username){
		  req.session.destroy();
	    res.json({'message':'You have been successfully logged out'});
	}
	else
		  res.json({'message':'You are not currently logged in'});
});

app.post('/add',function(req,res){
  if(req.session.username){
		  var num1=req.body.num1;
      var num2=req.body.num2;
      if(Number.isInteger(num1)&&Number.isInteger(num2))
          res.json({'message':'The action was successful','result':(num1+num2)})
      else
          res.json({'message':'The numbers you entered are not valid'});
	}
	else
		  res.json({'message':'You are not currently logged in'});
});

app.post('/divide',function(req,res){
  if(req.session.username){
		  var num1=req.body.num1;
      var num2=req.body.num2;
      if(Number.isInteger(num1)&&Number.isInteger(num2))
          res.json({'message':'The action was successful','result':(num1/num2)})
      else
          res.json({'message':'The numbers you entered are not valid'});
	}
	else
		  res.json({'message':'You are not currently logged in'});
});

app.post('/multiply',function(req,res){
  if(req.session.username){
		  var num1=req.body.num1;
      var num2=req.body.num2;
      if(Number.isInteger(num1)&&Number.isInteger(num2))
          res.json({'message':'The action was successful','result':(num1*num2)})
      else
          res.json({'message':'The numbers you entered are not valid'});
	}
	else
		  res.json({'message':'You are not currently logged in'});
});
