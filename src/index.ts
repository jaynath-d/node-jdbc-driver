// Import interface
import IConnectionType, { QueryType } from "./IConnectionType";
import IConnectionConfig from "./IConnectionConfig";
import IDrivers from "./IDrivers";

// Import all drivers
import HiveDriver from "./hive/HiveDriver";
import PostgreSQL from "./postgresql/PostgreSQL";

// Import dependecies
const jdbc = require('jdbc');
const jinst = require('jdbc/lib/jinst');
const path = require('path');

// Connection Type
export enum ConnectionType {
    hive = 'H', // using hive driver
    // mysql = 'M', // using mysql driver
    postgreSql = 'P', // using postgre sql driver
}

const CType = {
    H: HiveDriver,
    // M: '',
    P: PostgreSQL,
};

export default class JdbcDriver implements IDrivers{
    protected jarPath = '../drivers/';
    protected static connection: any = new Map();
    protected driverInstance:IConnectionType;
    constructor(type: ConnectionType, connectionConfig: IConnectionConfig) {
        this.driverInstance = new CType[type](connectionConfig)
        if (!jinst.isJvmCreated()) {
            jinst.addOption('-Xrs');
            jinst.setupClasspath([path.join(__dirname, this.jarPath + this.driverInstance.driver)]);
        }
        const connection = new jdbc(this.driverInstance.get_config())
        JdbcDriver.connection.set('test', connection)
    }

    public get_version = () => this.driverInstance.get_version();
    public get_columns = async (tableName: string) => await this.sql(this.driverInstance.get_query(tableName, QueryType.columns))
    public get_table_properties = async (tableName: string) => await this.sql(this.driverInstance.get_query(tableName, QueryType.describe))
    public findAll = async (tableName:string) => await this.sql(`SELECT * FROM ${tableName}`)
    public count = async (tableName: any) => await this.sql(`SELECT COUNT(*)  from ${tableName}`)
    public find = async (tableName: string, where: number|string = 1) => await this.sql(`SELECT * FROM ${tableName} WHERE ${where}`)

    public sql = async (sql:string) => {
        try{
            const res = this.executeQuery(sql)
            return res
        }catch(err){
            console.log('Error in sql:::', err)
        }

    }

    // protected close =async () => {
    //     try{
    //         const connection = JdbcDriver.connection.get('test')
    //         if(this.is_init(connection)){

    //         }
    //     }catch(err){
    //         console.log('Connection close error:::::', err)
    //     }
    // }

    protected executeQuery = async (sql:any) => {
        return new Promise(async (resolve, reject) => {
            const statement: any = await this.createStatement()
            statement.executeQuery(sql, async (err:any, resultset:any) => {
                if(err) reject(err)
                else {
                    await resultset.toObjArray((err:any, rows: any) => {
                        if (err) reject(err)
                        else resolve(rows)
                    })                    
                }
            })
        })
    }

    protected createStatement = async () => {
        return new Promise(async (resolve, reject) => {
            const connObj: any = await this.open()
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                const conn = connObj.conn;
                conn.createStatement((err:any, statement: any) => {
                    if(err) reject(err)
                    else resolve(statement)
                })
            }else{
                reject('Connection object not found')
            }
        })
    }

    protected open = async () => {
        return new Promise(async (resolve, reject) => {
            const connection = JdbcDriver.connection.get('test')
            if (this.is_init(connection)){
                resolve(connection._reserved[0])            
            }else{
                await this.init(connection) 
                connection.reserve((err:any, connObj: any) => {
                    if (err) {
                        reject(err)
                    }else{
                        resolve(connObj)
                    }
                })
            }            
        })
    }

    protected is_init = (conn:any) => {
        return conn._reserved.length
    }

    protected init =async (connection:any) => {
        connection.initialize((err: any) => {
            if (err) {
                console.log(err);
                return;
            }
            JdbcDriver.connection.set('test', connection)
        })
    }
}
