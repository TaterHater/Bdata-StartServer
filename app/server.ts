/* app/server.ts */

// Import everything from express and assign it to the express variable
const dotenv = require('dotenv');
const express = require("express");
import { Request, Response } from "express";
import passport from "passport";
import * as bodyParser from "body-parser";
const bdata = require("./bdata/index");
const helmet = require("helmet");

// Import WelcomeController from controllers entry point
import { LoginController } from "./controllers";

const app = express();
const b = new bdata();
const port: number = 3000;
dotenv.config();


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
//security stuff
app.use(helmet());
app.use(
  require("express-session")({
    secret: "Richard Nixon",
    resave: false,
    saveUninitialized: false
  })
);
app.use("/", LoginController);
app.get("/bdata/query", ensureAuthenticated, (req: Request, res: Response) => {
  //badRequest if these fields are missing
  if (!req.body.tableName || !req.body.query) {
    res.statusCode = 400;
    res.send("error");
  }
  b.query(req.body.tableName, req.body.query, "*", req.body.condition).then(
    (result: any) => {
      res.json(result);
    }
  );
});
app.get("/bdata/model", ensureAuthenticated, (req: Request, res: Response) => {
  if (!req.body.tableName) {
    res.statusCode = 400;
    res.send("error");
  }
  b.generateFromTableName(req.body.tableName).then((text: any) => {
    res.sendFile(text);
  });
});

function ensureAuthenticated(req: Request, res: Response, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("failed to authenticate");
}

app.on("listening", function() {
  console.log("ok, server is running");
});
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});
