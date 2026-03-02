// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

//pug
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    // Set up an array of data
    var test_data = ['one', 'two', 'three', 'four'];
    // Send the array through to the template as a variable called data
    res.render("index", {'title':'My index page', 'heading':'My heading', 'data':test_data});
});

//task 1
app.get("/all-students", function(req, res) {
    var sql = "select * from students";
    db.query(sql).then(results => {
        console.log(results);
        res.json(results)
    });
});

// Task 2 display a formatted list of students
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-students template
    	    // The rows will be in a variable called data
        res.render('all-students', {data: results});
    });
});


// Create a route for roehampton with some logic processing the request string
app.get("/roehampton", function(req, res) {
    console.log(req.url)
    let path = req.url;
    res.send(path.substring(0,3))
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

app.get("/student-single/:id", async function(req, res) {
    try {
        // Get student info
        const student = await db.query('SELECT * FROM Students WHERE id = ?', [req.params.id]);

        // Get student programme info
        const programmeInfo = await db.query('SELECT * FROM Student_Programme WHERE id = ?', [req.params.id]);

        // Get modules for that programme
        const modules = await db.query(
            'SELECT module FROM Programme_Modules WHERE programme = ?',
            [programmeInfo[0].programme]  // assuming programmeInfo has at least one row
        );

        if(student.length === 0) {
            return res.status(404).send('Student not found');
        }

        // Convert modules array of objects to a simple array of module names
        const moduleNames = modules.map(m => m.module);

        // Render the Pug template called 'student-single.pug'
        res.render('student-single', {
            student: student[0],
            programme: programmeInfo[0],
            modules: moduleNames
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching student data');
    }
});

// Create a route for testing the db
app.get("/db_test/:id", function(req, res) {

    // 1. Capture the id parameter from the URL
    var id = req.params.id;

    // 2. SQL query with a WHERE clause
    var sql = 'SELECT name FROM test_table WHERE id = ?';

    // 3. Run query and pass id as parameter
    db.query(sql, [id]).then(results => {
        console.log(results);

        // If a matching record is found
        if (results.length > 0) {
            // 4. Output only the name
            res.send(`<h2>Name for ID ${id}</h2><p>${results[0].name}</p>`);
        } else {
            res.send("No record found for this ID");
        }
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name/:id", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name + " with id " + req.params.id);
});

app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});