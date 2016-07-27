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
 * FYI, middleware can really be thought of as
 * functions that we can use to manipulate the request and response 
 * Ref: https://www.npmjs.com/package/body-parser
 */

var bodyParser = require("body-parser");

/**
 * Simple, fast generation of RFC4122 UUIDS.
 *
 * Ref: https://www.npmjs.com/package/node-uuid & https://github.com/broofa/node-uuid
 */

var uuid = require("node-uuid");

/**
 * Pull in the AWS SDK
 * Setup DynamoDB
 *
 * Ref: http://aws.amazon.com/developers/getting-started/nodejs/
 */
var AWS = require("aws-sdk");

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
 * Import the `admin` module instance
 *
 * Then define/add the `admin` routes to our chat application
 *
 * To do this use `app.use();` just as we did earlier with middleware
 * and pass it the `adminRouter` instance
 * Note: This is considered to be mounting the `adminRouter`
 */
var adminRouter = require("./admin");
app.use("/admin", adminRouter);
/**
 * Binds and listens for connections on the specified host and port.
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(3000, function() {
  console.log('Chat application is listening on port 3000');
});
