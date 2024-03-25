// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
const cors = require('cors');

// deprecated, now included in Express
//var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

// import the routing file to handle the default (index) route
var index = require('./server/routes/api/app');

// ... ADD CODE TO IMPORT YOUR ROUTING FILES HERE ... 
const messageRoutes = require('./server/routes/api/messages');
const contactRoutes = require('./server/routes/api/contacts');
const documentRoutes = require('./server/routes/api/documents');

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(express.json());
app.use(express.urlencoded({extended: false}));

/*
// deprecated, now included in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
*/
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS - this attempt from the supplied code doesn't work.
/*
documents:1 Access to XMLHttpRequest at 'https://wdd433dh-cms.netlify.app/api/documents' from origin 'http://localhost:4200' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

However, was this code even struck? It is possible Netlify was only running Angular, not the server.
*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


// Add support for CORS
//app.use(cors());
// Tell express to use the specified director as the
// root directory for your web site
app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

// Tell express to map the default route ('/') to the index route


app.use("/", index);

// ... ADD YOUR CODE TO MAP YOUR URL'S TO ROUTING FILES HERE ...
app.use('/api/messages', messageRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/documents', documentRoutes);

// Tell express to map all other non-defined routes back to the index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

//from https://mongoosejs.com/docs/connections.html
mongoose.connection.on('connected', () => console.log('Connected to database!'));
//mongoose.connect('mongodb://localhost:27017/cms')
mongoose.connect(process.env.MONGO_URI)
  .catch(error => {
    console.log('Connection failed: ' + error);
  });

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
