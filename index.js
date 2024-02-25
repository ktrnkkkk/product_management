const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash  = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const database=require("./config/database");

const systemConfig=require("./config/system");

const routeAdmin=require("./routes/admin/index.route");
const route=require("./routes/client/index.route");

database.connect();


const app=express(); //ktao app
const port = process.env.PORT;

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended: false}));


//cau hinh pug vao du an
app.set("views",`${__dirname}/views`);
app.set("view engine","pug");

//Flash
app.use(cookieParser("kkkkkkkkk"));// string randoom tu tao ra 
app.use(session({cookie: {maxAge: 6000}}));
app.use(flash());
//end flash

// App locals variables
app.locals.prefixAdmin=systemConfig.prefixAdmin;//ton tai trong tat ca cac file pug


//app.use(express.static("public")); day len online no ko hieu la gi
//__dirname: cau truc thu muc
app.use(express.static(`${__dirname}/public`))

//Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});