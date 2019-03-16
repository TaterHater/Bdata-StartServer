


export class DescribeModel {

    Field:string;
    Type:string;
    Null: string;
    Defualt:string;
    Extra: string


    constructor(field:string, type:string, nul:string, d:string, extra:string){
        this.Field = field;
        this.Type = type;
        this.Null = nul;
        this.Defualt = d,
        this.Extra = extra;
    }

}