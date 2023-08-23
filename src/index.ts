// Import interface
import IConnectionType, { QueryType } from "./IConnectionType";
import IConnectionConfig from "./IConnectionConfig";
import IDrivers from "./IDrivers";

// Import all drivers
import HiveDriver from "./hive/HiveDriver";
import PostgreSQL from "./postgresql/PostgreSQL";
import Sqlite from "./sqlite/Sqlite";
import CustomDriver from "./custom/driver";

// Import dependecies
const jdbc = require('jdbc');
const jinst = require('jdbc/lib/jinst');
const path = require('path');

// Connection Type
export enum ConnectionType {
    hive = 'H', // using hive driver
    postgreSql = 'P', // using postgre sql driver
    sqlite = 'S', // using sqlite driver
    custom = 'C', // Connect any jdbc connection using custom driver
}


const CType = {
    H: HiveDriver,
    P: PostgreSQL,
    S: Sqlite,
    C: CustomDriver
};


export default class JdbcDriver<T extends ConnectionType> implements IDrivers{
    protected jarPath = '../drivers/';
    protected static connection: any = new Map();
    protected driverInstance:IConnectionType;
    protected type: T;
    constructor(type: T, connectionConfig: IConnectionConfig<T>) {
        this.type = type
        this.driverInstance = this.createDriverInstance(type, connectionConfig)
        if (!jinst.isJvmCreated()) {
            jinst.addOption('-Xrs');
            jinst.setupClasspath([path.join(__dirname, `${type === 'C'? '' : this.jarPath}${this.driverInstance.driver}`)]);
        }
        const connection = new jdbc(this.driverInstance.get_config())
        JdbcDriver.connection.set(this.type, connection)
    }

    protected createDriverInstance(type: T, config: IConnectionConfig<T>){
        const DriverClass = CType[type];
        if(!DriverClass){
            throw new Error(`Invalid type ${type}`)
        }
        return new DriverClass(config as any)
    }

    public get_version = () => this.driverInstance.get_version();
    public get_columns = async (tableName: string) => await this.sql(this.driverInstance.get_query(tableName, QueryType.columns))
    public get_table_properties = async (tableName: string) => await this.sql(this.driverInstance.get_query(tableName, QueryType.describe))
    public findAll = async (tableName:string) => await this.sql(`SELECT * FROM ${tableName}`)
    public count = async (tableName: any) => await this.sql(`SELECT COUNT(*) as total from ${tableName}`)
    public find = async (tableName: string, where: number|string = 1) => await this.sql(`SELECT * FROM ${tableName} WHERE ${where}`)
    public connection_count = () => JdbcDriver.connection.size;
    public connection_details = () => JdbcDriver.connection.entries();

    public sql = async (sql:string) => {
        try{
            const res = this.executeQuery(sql)
            return res
        }catch(err){
            console.log('Error in sql:::', err)
        }
    }

    public ddl = async (sql:string) => {
        try{
            const res = this.executeUpdate(sql)
            return res
        }catch(err){
            console.log('Error in ddl:::', err)
        }
    }

    protected close = async (connObj:any) => {
        try{
            const coon = JdbcDriver.connection.get(this.type)
            coon.release(connObj,(err:any) => {
                if(err) console.log('Connection relase issues::::')
                else console.log('Connection relase')
            })
        }catch(err){
            console.log('Connection close error:::::', err)
        }
    }

    protected executeQuery = async (sql:any) => {
        return new Promise(async (resolve, reject) => {
            const stat: any = await this.createStatement()
            stat[0].executeQuery(sql, async (err:any, resultset:any) => {
                if(err) reject(err)
                else {
                    await resultset.toObjArray((err:any, rows: any) => {
                        if (err) reject(err)
                        else resolve(rows)
                        stat[0].close((err:any)=> {
                            if(err) console.log('Statement closing issues...', err)
                            else {
                                console.log('Statement closed.')
                                this.close(stat[1])
                            }
                        })
                    })                    
                }
            })
        })
    }

    protected executeUpdate = async (sql:any) => {
        return new Promise(async (resolve, reject) => {
            const stat: any = await this.createStatement()
            stat[0].executeUpdate(sql, async (err:any, count:any) => {
                if(err) reject(err)
                else resolve(count)
                stat[0].close((err:any)=> {
                    if(err) console.log('Statement closing issues::::')
                    else {
                        console.log('Statement closed')
                        this.close(stat[1])
                    }
                })
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
                    else resolve([statement, connObj])
                })
            }else{
                reject('Connection object not found')
            }
        })
    }

    protected open = async () => {
        return new Promise(async (resolve, reject) => {
            const connection = JdbcDriver.connection.get(this.type)
            if (this.is_init(connection)){
                resolve(connection._reserved[0])            
            }else{
                if(!connection._pool.length){
                    await this.init(connection)
                } 
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
        return new Promise(async (resolve, reject) => {
            connection.initialize((err: any) => {
                if (err) reject(err)
                else {
                    JdbcDriver.connection.set(this.type, connection)
                    resolve('')
                }
            })
        })
    }
}
