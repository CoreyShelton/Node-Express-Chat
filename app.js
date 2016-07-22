/**
 * This creates an Express application.
 * The express() function is a top-level function exported by the express module.
 *
 * Ref: https://expressjs.com/en/starter/hello-world.html
 */
var express = require("express");
var app = express();

/**
 * Lodash makes JavaScript easier by taking the hassle out of working with arrays,
 * numbers, objects, strings, etc. Lodash’s modular methods are great for:
 *
 * - Iterating arrays, objects, & strings
 * - Manipulating & testing values
 * - Creating composite functions
 * Ref: https://lodash.com/ & https://lodash.com/docs
 */
var _ = require("lodash");

/**
 * Parse incoming request bodies in a middleware before your handlers,
 * availabe under the req.body property.
 *
 * Ref: https://www.npmjs.com/package/body-parser
 */

var bodyParser = require("body-parser");

/**
 * Simple, fast generation of RFC4122 UUIDS.
 *
 * Ref: https://www.npmjs.com/package/node-uuid & https://github.com/broofa/node-uuid
 */

var uuid = require('node-uuid');

/**
 * Pull in the AWS SDK
 * Setup DynamoDB
 *
 * Ref: http://aws.amazon.com/developers/getting-started/nodejs/
 */
var AWS = require("aws-sdk");

/**
 * Import JSON data for rooms
 */
var rooms = require("./data/rooms.json");

/**
 * Set the views directory
 * Set view engine
 */
app.set("views", "./views");
app.set('view engine', 'pug');

/**
 * Specify static directories to watch
 */
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));

/**
 * Use body-parser to create an instance of a piece of middleware
 * to parse out the body of the /admin/rooms/add form submission
 *
 * NOTE: This needs to be registered prior to any routes that may
 * rely upon it.
 *
 * Ref: https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions
 */
 app.use(bodyParser.urlencoded({
    extended: true
  })
);

/**
 * Home Route:
 * Directs users to the primary "home" page of the site
 */
app.get('/', function (req, res) {
    res.render("index", { title: "new home"});
});

/**
 * Rooms ADMIN landing page Route:
 * Directs users to the Rooms admin page
 */
app.get('/admin/rooms', function (req, res) {
    res.render("rooms", {
        title: "Admin Rooms",
        rooms: rooms
    });
});


/**
 * Rooms ADMIN add new chat room Route:
 * Directs users to the Rooms admin page
 *
 * Uses two routes
 *  1) GET: Outputs the form view
 *  2) POST: Handles form data when form is submitted
 */
app.get('/admin/rooms/add', function(req, res) {
  res.render("add");
});


app.post('/admin/rooms/add', function(req, res) {
  /**
   * Create Obect to add form data to to "rooms" data
   * @param id: Uses node-uuid module to create random id
   * @param name: Uses the request body "name" param
   */
  var room = {
    id: uuid.v4(),
    name: req.body.name
  }

  /**
   * Add form input object to rooms data
   */
  rooms.push(room);

  /**
   * Pass the response object a
   * JSON object, this will in turn
   * return the form data back to the client
   */
  // res.json(room); // Return form input data
  // res.json(rooms); // Return entire JSON object for all chat rooms

  /**
   * Redirect back to the main chat rooms page
   */
   res.redirect("/admin/rooms");
});

/**
 * Rooms ADMIN delete chat room route:
 * By adding a colon ":" in front of "id"
 * we are defining a route parameter named "id"
 * This tokenizes our route enabling us to pull out
 * dynamic parameters
 */
app.get('/admin/rooms/edit/:id', function(req, res) {

  /**
   * The url's route param named "id"
   * will then be parsed out and made available
   * on the request object via a params object.
   * A property will then be created named "id",
   * since thats the name of the param that we
   * specified in the url's route parameter.
   *
   * This will become  our "roomID" variable
   */
  var roomID = req.params.id

  /**
   * Use functionality thats exported using the lodash module
   * Use the `_.find` functionality, which takes a collection (array)
   * - Passes an array as the first parameter
   * - Passes a function that can filter and find the item in the array
   *   that we want to edit.
   * In our case we want to find the room
   * that matches the roomID route parameter being passed in.
   *
   * The first item that matches this predicate: r => r.id === roomID
   * will be returned to us and we'll capture that in a new `room` variable
   */
  var room = _.find(rooms, r => r.id === roomID);

  /**
   * Check if the room exists and if it doesn't then
   * display a 404 error message
   */
  if(!room) {
    res.sendStatus(404);
    return;
  }

  /**
   * Render an 'edit' view
   * Add an options object, so that we can pass the room
   * that we pulled out of the `rooms` collection
   *
   * In other words render the `edit` view
   * then pass to it data that contains the room name
   * of the room we're currently editing
   */
  res.render("edit", {room});
});

/**
 * This route actually updates the room name
 * when the "Save Chat Room" button is clicked
 */
app.post('/admin/rooms/edit/:id', function(req, res) {

  /**
   * The url's route param named "id"
   * will then be parsed out and made available
   * on the request object via a params object.
   * A property will then be created named "id",
   * since thats the name of the param that we
   * specified in the url's route parameter.
   *
   * This will become  our "roomID" variable
   */
  var roomID = req.params.id

  /**
   * Use functionality thats exported using the lodash module
   * Use the `_.find` functionality, which takes a collection (array)
   * - Passes an array as the first parameter
   * - Passes a function that can filter and find the item in the array
   *   that we want to edit.
   * In our case we want to find the room
   * that matches the roomID route parameter being passed in.
   *
   * The first item that matches this predicate: r => r.id === roomID
   * will be returned to us and we'll capture that in a new `room` variable
   */
  var room = _.find(rooms, r => r.id === roomID);

  /**
   * Check if the room exists and if it doesn't then
   * display a 404 error message
   */
  if(!room) {
    res.sendStatus(404);
    return;
  }
  
  /**
   * This changes the room's name
   * to the room name that you updated it to
   */
  room.name = req.body.name;

  /**
   * Redirect back to the main chat rooms page
   */
  res.redirect("/admin/rooms");
});

/**
 * Rooms ADMIN delete chat room route:
 * By adding a colon ":" in front of "id"
 * we are defining a route parameter named "id"
 * This tokenizes our route enabling us to pull out
 * dynamic parameters
 */
app.get('/admin/rooms/delete/:id', function(req, res) {

  /**
   * The url's route param named "id"
   * will then be parsed out and made available
   * on the request object via a params object.
   * A property will then be created named "id",
   * since thats the name of the param that we
   * specified in the url's route parameter.
   *
   * This will become  our "roomID" variable
   */
  var roomID = req.params.id

  // Remove this room from the rooms array
  rooms = rooms.filter(r => r.id !== roomID);

  // Redirect back to the chat rooms
  res.redirect("/admin/rooms");

  //res.send(roomID);
});

/**
 * Test JSON route
 */
/*
app.get('/json', function (req, res) {

  var quotes = [
    {
      author : 'Audrey Hepburn',
      text : "Nothing is impossible, the word itself says 'I'm possible'!"
    },
    {
      author : 'Walt Disney',
      text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"
    },
    {
      author : 'Unknown',
      text : "Even the greatest was once a beginner. Don't be afraid to take that first step."
    },
    {
      author : 'Neale Donald Walsch',
      text : "You are afraid to die, and you're afraid to live. What a way to exist."}
  ];
  res.json(quotes);
});
*/

/**
 * Binds and listens for connections on the specified host and port.
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(3000, function() {
  console.log('Chat application is listening on port 3000');
});
