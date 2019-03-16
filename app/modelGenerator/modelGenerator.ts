import { DescribeModel } from "../models/describeModel";

let mysql = require("mysql2");

let connection = mysql.createConnection({
  host: process.env.MYSQL_ADDRESS,
  port: process.env.PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

export class ModelGenerator {
  constructor() {}
  generateFromTableName(name: string) {
    console.log('start');
    let final=''
    connection.query(`DESCRIBE ${name}`),
      (err: any, results: any, fields: any) => {
        console.log('query start');
        if (!err) {
         let objects =  JSON.parse(results)
         console.log(objects)
         objects.forEach((element:DescribeModel) => {
           let line =  this.elementParser(element)
             console.log(line)
             final+=line
         });
         final += this.constructorConstructor(objects)
         this.writeToFile('test',final)
        } else {
          console.log(err);
        }
      };
  }
  elementParser(ds:DescribeModel){
    let returnString:string = `${ds.Field}:`;
    if(ds.Type.includes('int' || ds.Type.includes('float'))){
         returnString+= `number;`
    }
    else if(ds.Type === 'Bit'){
        returnString+= `boolean;`
    }
    else{
        //treat everything else as a string
        returnString+= `string;`
    }
    return returnString;
  }

  constructorConstructor(arr:string[]){
      let constructor:string = `constructor(`
      arr.forEach((element, index) => {
          constructor+= `${element.toLowerCase}:any`
          if(index != arr.length) constructor+=`,`
      });
      constructor+=`){`
      arr.forEach((element, index) => {
        constructor+= `this.${element}= ${element.toLowerCase};`
    });
    constructor+=`} }`

  }

  writeToFile(filename: string, content:string) {
    console.log(`${filename}: ${content}`)
  }
}
module.exports = new ModelGenerator()
