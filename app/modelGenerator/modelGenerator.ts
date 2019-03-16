import { DescribeModel } from "../models/describeModel";

let mysql = require("mysql2");

   let connection =  mysql
    .createConnection({
      host: "192.168.0.15",
      port:"3006",
      user: "root",
      password: "raspberry",
      database: "Beecon"
    })

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
