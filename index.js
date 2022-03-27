var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.set('view engine', 'ejs');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uttamnode'
});

conn.connect(function (err) {
    if (err) throw err;
    console.log('connection successfull');
});
app.get('/insert', function (req, res) {
    //res.send("<h1>hello sir</h2><input type='text' name='fname'/>");
    res.render('insert');
});
app.get('/', function (req, res) {
    //res.send("<h1>hello sir</h2><input type='text' name='fname'/>");
    res.render('login');
});

app.post('/insert', function (req, res) {
    var name = req.body.user_name;
    var email = req.body.user_email;
    var password = req.body.user_password;
    var sql = `INSERT INTO testassignment (user_name,user_email,user_password) VALUES ('${name}','${email}','${password}')`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        res.render('login');
    });
});

app.get('/dashbord', function (req, res) {
    var sql = `SELECT * FROM testassignment`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        res.render('dashbord',{users:result});
    });
});

app.get('/assigntask', function (req, res) {
    var sql = `SELECT * FROM testassignment`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        res.render('assigntask',{users:result});
    });
});

app.post('/addtask', function (req, res) {
    var user_id = req.body.user_id;
    var user_task = req.body.user_task;

    var sql = `UPDATE testassignment SET user_task = '${user_task}' WHERE user_id = '${user_id}'`;
    conn.query(sql, function (err) {
        if (err) throw err;
        else{
          
            var sql = `SELECT * FROM testassignment`;
            conn.query(sql, function (err, result) {
                if (err) throw err;
                res.render('dashbord',{users:result});
            });
        
        }
        
    });
});


app.post('/userdashbord', function (req, res) {
    user_email = req.body.user_email;
    user_password =req.body.user_password;
    if(user_email == 'admin@gmail.com' && user_password=='admin'){
        var sql = `SELECT * FROM testassignment`;
        conn.query(sql, function (err, result) {
            if (err) throw err;
            res.render('dashbord',{users:result});
        });
    }else{
        var sql = `SELECT * FROM testassignment WHERE user_email = '${user_email}' AND user_password = '${user_password}'`;
        conn.query(sql, function (err, result) {
            if (err) throw err;
            if(result==''){
                res.render('login'); 
            }else{
                res.render('userdashbord',{user:result});
            }
            
        });
    }
 
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = `DELETE FROM testassignment WHERE user_id = ${id}`;
    conn.query(sql, function (err) {
        if (err) throw err;
        else{
            var sql = `SELECT * FROM testassignment`;
            conn.query(sql, function (err, result) {
                if (err) throw err;
                res.render('dashbord',{users:result});
            });
        }
        
    });
});

app.get('/deletetask/:id', function (req, res) {
    var user_id = req.params.id;
    var user_task = '';

    var sql = `UPDATE testassignment SET user_task = '${user_task}' WHERE user_id = '${user_id}'`;
    conn.query(sql, function (err) {
        if (err) throw err;
        else{
          
            var sql = `SELECT * FROM testassignment`;
            conn.query(sql, function (err, result) {
                if (err) throw err;
                res.render('dashbord',{users:result});
            });
        
        }
        
    });
});

app.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM testassignment WHERE user_id = ${id}`;

    conn.query(sql, function (err,result) {
        if (err) throw err;
        if(result==''){
            res.render('login'); 
        }else{
            res.render('edit',{user:result});
        }
        
    });
});


    app.post('/update', function (req, res) {
        var id = req.body.user_id;
        var name = req.body.user_name;
        var email = req.body.user_email;
        var password = req.body.user_password;
        // var task = req.body.user_task;
        var sql = `UPDATE testassignment SET user_name = '${name}',user_email = '${email}',user_password = '${password}' WHERE user_id = ${id}`;
        conn.query(sql, function (err) {
            if (err) throw err;
            else{
                var sql = `SELECT * FROM testassignment WHERE user_email = '${email}' AND user_password = '${password}'`;
                conn.query(sql, function (err, result) {
                    if (err) throw err;
                    if(result==''){
                        res.render('login'); 
                    }else{
                        res.render('userdashbord',{user:result});
                    }
                    
                });
            }
            
        });
    });

var server = app.listen(3000, function () {
    console.log("App is runing on 3000....");
});
