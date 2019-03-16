/* app/controllers/welcome.controller.ts */
import { Router, Request, Response } from "express";
import passportLocal from "passport-local";
import { ModelGeneratorController } from "./";

const router: Router = Router();
const bdata = require("../bdata/index");
const b = new bdata();
const passport = require("passport");
const LocalStrategy = passportLocal.Strategy;
const encryptionTools = require("../services/encryptionTools");
const eTools = new encryptionTools();
const test = require("../UserController");

let t = new test();

passport.serializeUser(function(user: any, cb: any) {
  cb(null, user);
});

passport.deserializeUser(function(id: any, cb: Function) {
  b.query(`User`, `Get`, "*", `UserId= ${id.UserId}`).then((res: any) => {
    cb(null, res);
  });
});
passport.use(
  new LocalStrategy((username: string, password: string, done: any) => {
    b.query(`User`, `Get`, "Salt", `Email = '${username}'`).then((res: any) => {
      let tempPass: any = eTools.saltHashPassword(
        password,
        JSON.parse(res)[0]["Salt"]
      );
      b.query(
        `User`,
        `Get`,
        "*",
        ` Email = '${username}'AND PasswordHash = '${tempPass.passwordHash}'`
      ).then((res: any) => {
        done(null, JSON.parse(res)[0]);
      });
    });
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req: any, res) => {
    res.send(`sucess: ${JSON.stringify(req.session)}`);
  }
);
router.use("/model", ModelGeneratorController);

router.get("/j", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send("General Kenobi");
  } else {
    b.generateFromTableName("User").then((result: any) => {
      res.send(result);
    });
  }
});
router.post("/register", (req: Request, res: Response) => {
  if (req.body.password && req.body.username && req.body.confirmPassword) {
    if (req.body.password == req.body.confirmPassword) {
      let passInfo: any = eTools.saltHashPassword(req.body.password);
      t.createUser(
        req.body.username,
        passInfo.passwordHash,
        passInfo.salt
      ).then((response: any) => {
        res.send(`user Created: ${response}`);
      });
    }
  } else {
    res.send("registration failed");
  }
});

export const LoginController: Router = router;
