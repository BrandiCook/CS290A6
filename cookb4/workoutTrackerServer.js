var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// setups handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9712);

// setups POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// locates addl data
app.use(express.static(__dirname + '/public'));

// setts up sessions. minimum is just secret 
app.use(session({secret:'Secret'}));

// processes GET requests
app.get('/', function(req,res){
	var getContext = {};
	res.render('workoutPage', getContext);
});

app.post('/', function(req,res){
	var getContext = {};
	res.render('workoutPage', getContext);
})


// returns table
app.get('/getTable', function(req,res,next){
	var getContext = {};
	  mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    getContext.table = JSON.stringify(rows);
	res.send(getContext.table);
  });
});

// takes ID and returns entry with that ID	
app.post('/getId',function(req,res,next){
	var getContext = {};
	if(req.body){
		console.log(req.body);
	}

	mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }

    getContext.table = JSON.stringify(result);
	console.log(getContext.table);
	res.send(getContext.table);
	
  });

});

// takes ID and deletes from table
app.post('/delete',function(req,res,next){
	var getContext = {};
	if(req.body){
		console.log(req.body);
	}
	
	mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
	
	// deleted returns new table
	mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

    getContext.table = JSON.stringify(rows);
	console.log(getContext.table);
	res.send(getContext.table);
	
	});
	
  });

});

// takes name, reps, weight, date, and lbs -> inserts as new entry into table
app.post('/insert', function(req,res,next){
	var getContext = {};
	if(req.body){
		console.log(req.body);
	}

	mysql.pool.query("INSERT INTO workouts SET name=?, reps=?, weight=?, date=?, lbs=?", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
	
	// insert is good -> return new table
	mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
	
	getContext.table = JSON.stringify(rows);
	console.log(getContext.table);
	res.send(getContext.table);
	
	});
  });	
});

// takes ID and anything that changed and updates 
// if no changes, stays same
app.post('/update',function(req,res,next){
	var getContext = {};
	if(req.body){
		console.log(req.body);
	}
	
	mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }

	if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs, req.body.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        
		// insert is good -> returns new table
		mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
		if(err){
		  next(err);
		  return;
		}
		
		getContext.table = JSON.stringify(rows);
		console.log(getContext.table);
		res.send(getContext.table);
		
		});
      });
	
	}
    
	
  });

});

// RESET TABLE PAGE
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ // replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      
      console.log("Table reset");
	  res.render('workoutPage', context);
	  
    });
 });
});

// 404 page, page not found
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// 500 page, server broke
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// sample db[{"id":1,"name":"brandi","done":null,"due":null},{"id":1,"name":"Mysql","done":null,"due":null}