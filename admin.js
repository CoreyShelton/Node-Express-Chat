/**
 * By creating the admin module in the following way
 * We are making the `admin` module anonymous about how it can being used
 *
 * All it does is define this (line 45) `router` and export it
 */


/**
* Simple, fast generation of RFC4122 UUIDS.
*
* Ref: https://www.npmjs.com/package/node-uuid & https://github.com/broofa/node-uuid
*/
var uuid = require('node-uuid');

/**
 *  Admin Module
 *
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
 * Import Express to this module
 */
var express = require("express");

/**
 * Import JSON data for rooms
 */
var rooms = require("./data/rooms.json");

/**
 * Create an instance of a Router using the Express module
 * The router object is an isolated instance of middleware and routes.
 * You can think of it as a “mini-application,”
 * wherein it is capable of only performing middleware and routing functions.
 *
 * `router` as a mini-application serves the purpose
 * of the global `app` object found in `app.js`.
 * Excep now we have this modular router that is only concerned
 * with administrating chat rooms
 */
 var router = express.Router();
 module.exports = router;

/**
 * Rooms ADMIN landing page Route:
 * Directs users to the Rooms admin page
 */
router.get('/rooms', function (req, res) {
    res.render("rooms", {
        title: "Admin Rooms",
        rooms: rooms
    });
});

router.route('/rooms/add')
  /**
   * Rooms ADMIN add new chat room Route:
   * Directs users to the Rooms admin page
   *
   * Uses two routes
   *  1) GET: Outputs the form view
   *  2) POST: Handles form data when form is submitted
   */
  .get(function(req, res) {
    res.render("add");
  })
  .post(function(req, res) {
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
     *
     * On the request object there is a baseUrl property `req.baseUrl`
     * Using request objects baseUrl property will give us the correct path
     * based upon where the `router` was mounted at so in this case
     * it will be `/admin` – view app.js line 91
     */
     res.redirect(req.baseUrl + "/rooms");
  });

router.route('/rooms/edit/:id')
  .all(function(req, res, next){
    /**
     * This is middleware used to get the room ID
     *
     * Rooms ADMIN delete chat room route:
     * By adding a colon ":" in front of "id"
     * we are defining a route parameter named "id"
     * This tokenizes our route enabling us to pull out
     * dynamic parameters
     *
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
     * Use the local property of the response
     * to pass the same object that the `get` and `post`
     * routers want to use, which in this case is `room`
     */
    res.local.room = room;

    // next() passes on to the `get` and `post` routes
    next();
  })
  .get(function(req, res) {
    /**
     * Render an 'edit' view
     * Add an options object, so that we can pass the room
     * that we pulled out of the `rooms` collection
     *
     * In other words render the `edit` view
     * then pass to it data that contains the room name
     * of the room we're currently editing
     */
    res.render("edit");
  })
  .post(function(req, res) {
    /**
     * This changes the room's name
     * to the room name that you updated it to
     */
    res.locals.room.name = req.body.name;

    /**
     * Redirect back to the main chat rooms page
     */
    res.redirect(req.baseUrl + "/rooms");
  });

/**
 * Rooms ADMIN delete chat room route:
 * By adding a colon ":" in front of "id"
 * we are defining a route parameter named "id"
 * This tokenizes our route enabling us to pull out
 * dynamic parameters
 */
router.get('/rooms/delete/:id', function(req, res) {

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
  res.redirect(req.baseUrl + "/rooms");

  //res.send(roomID);
});
