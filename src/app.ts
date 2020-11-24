import * as readline from 'readline';
import { iDBInfo, iCSVFileInfo } from './db/dbtype';
import * as figlet from 'figlet';
import { DBConnection } from './db/dbconnection';
import * as fs from 'fs';
import * as csv from 'csv-parser'

class App {

    private dbinfo: iDBInfo | null;
    private csvInfo: iCSVFileInfo | null;
    private dbConnection: DBConnection | null = null;
    private loaderTimer: NodeJS.Timeout | null = null;
    private rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })

    constructor() {
        this.dbinfo = {};
        this.csvInfo = {};
    }
    private askSomthing = async (question: string, defaultValue?: string): Promise<string> => {
        return new Promise(resolve => {
            this.rl.question(question, (aw) => {
                resolve(aw && aw.length > 0 ? aw : (defaultValue ? defaultValue : ''));
            })
        });
    }

    private async askDBHost() {
        this.dbinfo.host = (await this.askSomthing(`=> Target DB host(default "localhost")? `, 'localhost'));
        this.dbinfo.user = (await this.askSomthing('=> Target DB user? '));
        this.dbinfo.password = (await this.askSomthing('=> Target DB password? '));
        this.dbinfo.database = (await this.askSomthing('=> Target DB database? '));

        this.dbConnection = new DBConnection(this.dbinfo);
        const result = await this.dbConnection.tryConnection();
        if (!result) console.log('fail to connection');
        else {
            console.log('success connection');
            this.askCSVFile();
        }
    }

    private async csvRead(filePath): Promise<boolean> {
        const results = [];
        return new Promise(resolve => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.createReadStream(filePath)
                        .pipe(csv())
                        .on('data', (data) => results.push(data))
                        .on('end', () => {
                            this.csvInfo.row = results;
                            console.log(`${results.length} row read`);
                            resolve(true);
                        });
                } else {
                    console.error('fail to read CSV file', filePath);
                    resolve(false);
                }
            } catch (e) {
                console.error('read csv file fail!!!');
                resolve(false);
            }
        });
    }

    private async selectDBPropertiesMapping(): Promise<boolean> {
        console.log(`CSV "${this.csvInfo.keyField}" ---> mapping Table and Column Select:`);
        
        const dbTable = (await this.askSomthing('=> Select Mapping DB Table: '));
        const dbColumn = (await this.askSomthing('=> Select Mapping DB Key Column: '));
        const dbUpdateField = (await this.askSomthing('=> Select Mapping DB Update Column: '));

        const agree1 = (await this.askSomthing(`=> "${this.csvInfo.keyField}" mapping --> "${dbTable}/${dbColumn}" sure?(y/n)`));
        const agree2 = (await this.askSomthing(`=> "${this.csvInfo.updateField}" update --> "${dbTable}/${dbUpdateField}" sure?(y/n)`));

        if(agree1 == 'y' && agree2 == 'y') {
            this.csvInfo.keyDBTable = dbTable;
            this.csvInfo.keyDBField = dbColumn;
            this.csvInfo.updateDBField = dbUpdateField;
            return true
        }
        return false;
    }

    private async showAndSelectColumn(): Promise<boolean> {
        if (this.csvInfo.row && this.csvInfo.row.length > 0) {
            const keys = Object.keys(this.csvInfo.row[0])
            console.log(`** Current CSV keys are ${keys}`);
            const key = (await this.askSomthing('=> Select Key Column: '));
            const updateField = (await this.askSomthing('=> Select Updated Data Column: '));
            
            if (key && keys.includes(key) && updateField && updateField.length > 0) {
                this.csvInfo.keyField = key;
                this.csvInfo.updateField = updateField;
                return true;
            } else return false;
        } else {
            return false;
        }
    }
    
    private async showAllInfomation() {
        console.log(`**************************************************************************`);
        console.log(`Key Mapping CSV[${this.csvInfo.keyField}]--> DB[${this.csvInfo.keyDBTable}/${this.csvInfo.keyDBField}]`);
        console.log(`Update Mapping CSV[${this.csvInfo.updateField}]--> DB[${this.csvInfo.keyDBTable}/${this.csvInfo.updateDBField}]`);
        console.log(`**************************************************************************`);
        const agree = (await this.askSomthing('=> start update? '));
        if(agree == 'y') {
            this.updateStart();
        }
    }

    private endQueryLoader() {
        if(this.loaderTimer) {
            clearInterval(this.loaderTimer);
        }
    }
    private startQueryLoader() {
        const P = ['\\', '|', '/', '-'];
        let x = 0;
        this.loaderTimer = setInterval(() => {
        process.stdout.write(`\r${P[x++]}`);
        x %= P.length;
        }, 250);
    }
    private async updateStart() {
        const keys = this.csvInfo.row.map( item => {
            return item[this.csvInfo.keyField];
        })
        const values = this.csvInfo.row.map( item => {
            return item[this.csvInfo.updateField];
        })
        this.startQueryLoader();
        console.log("updating now");
        const reuslt = await this.dbConnection.update(this.csvInfo.keyDBTable, this.csvInfo.keyDBField, this.csvInfo.updateDBField,keys,values,true);
        this.endQueryLoader();
        console.log('end update', reuslt);
    }

    private async askCSVFile() {
        const csvFilePath = (await this.askSomthing('=> Source CSV file path? '));
        if( (await this.csvRead(csvFilePath)) &&
            (await this.showAndSelectColumn()) &&
            (await this.selectDBPropertiesMapping()) ) {
                this.showAllInfomation()
            }
    }

    public start() {
        figlet(`SB 'CSV'->'DB' Update 0.1`, (error, data) => {
            console.log(data);
            this.askDBHost()
        });
    }
}

export default App;