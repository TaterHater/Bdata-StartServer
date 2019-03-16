const bdata = require("./bdata/index");
const connection = require("./services/mysqlController");

class UserController extends bdata {
    UserController(){
    }
    createUser(username: string, passwordHash: string, salt: string) {
        return new Promise((resolve, reject) => {
          connection.query(
            `INSERT INTO User (Username,Email,PasswordHash,Salt) VALUES(
                  ?,?,?,?
              )`,
            [username, username, passwordHash, salt],
            (err: any, results: any, fields: any) => {
              if (!err) {
                console.log(`results:${JSON.stringify(results)}`);
                return resolve(JSON.stringify(results));
              } else {
                console.log(err);
                return reject();
              }
            }
          );
        });
      }
}
module.exports = UserController;