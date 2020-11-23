import * as mysql from 'mysql';
import {Connection, ConnectionConfig} from 'mysql';

import { iDBInfo } from './dbtype';

export class DBConnection {
    private dbinfo: iDBInfo;
    private connection: Connection | null;


    constructor(db: iDBInfo) {
        this.dbinfo = db;
        this.connection = null;
    }

    public async tryConnection(): Promise<boolean> {
        return new Promise( resolve => {
            if(this.dbinfo.host && this.dbinfo.password) {
                try{
                    this.connection = mysql.createConnection({...this.dbinfo, multipleStatements: true} as ConnectionConfig);
                    this.connection.connect((err) => {
                        if(err) {
                            console.log(err.message); 
                            resolve(false);
                        } else resolve(true);
                    })
                    
                } catch(e) {
                    console.log('error connection database: ', e);
                    resolve(false);
                }
            }
        })
        
    }

    public update(table: string,
        keyColumn: string,
        column: string,
        keyValues: string[],
        values: string[], updateAtInclude: boolean = false,
        updateAtFieldName: string= 'updated_at'): Promise<boolean> {

        return new Promise( resolve => {
            if(keyValues.length != values.length) return false;
            let updateQueruTemplate = '';
            if(updateAtInclude) {
                updateQueruTemplate = `UPDATE ${table} SET \`${column}\` = ?, ${updateAtFieldName} = ? where ${keyColumn} = ?;`;
                
            } else {
                updateQueruTemplate = `UPDATE ${table} SET \`${column}\` = ? where ${keyColumn} = ?;`;    
            }
           
            let sqlm='';
            keyValues.forEach( (keyValue, index) => {
                if(updateAtInclude) {
                    sqlm += mysql.format(updateQueruTemplate, [values[index] && values[index].length > 0 ?values[index] : null , (new Date()).toLocaleString() ,keyValue]);
                } else {
                    sqlm += mysql.format(updateQueruTemplate, [values[index] && values[index].length > 0 ?values[index] : null , keyValue]);
                }
         
            });   
            this.connection.query(sqlm,  (error, results, fields) => {
                if (error) {
                    console.log(error);
                    console.log('error query----------------------^^');
                    return resolve(false);
                }
                let affectionRow = 0;
                let warningCount = 0;
                
                if(results && results.length > 0){
                    results.forEach(element => {
                        affectionRow += element.affectedRows;
                        warningCount += element.warningCount;
                    });
                    console.log(`Total Query Count: ${results.length}, affectionRow: ${affectionRow}, warningCount: ${warningCount}`)

                } else {
                    console.log("Not found result");
                }
                this.connection.end();
                return resolve(true);
            });
        })
      
    }
}
  
export default DBConnection;

