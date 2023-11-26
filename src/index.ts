// Import interface
import { QueryType } from "./IDatabase";
import IConnectionConfig from "./IConfig";
import IDrivers from "./IDrivers";

// Import all drivers
import Drivers from './drivers'

// Import dependecies
const jdbc = require('jdbc');
const jinst = require('jdbc/lib/jinst');
const path = require('path');

// Connection Type
export enum ConnectionType {
    hive = 'hive', // using hive driver
    postgreSql = 'postgresql', // using postgre sql driver
    sqlite = 'sqlite', // using sqlite driver
    tibero = 'tibero', // using tibero driver
    custom = 'custom', // Connect any jdbc connection using custom driver
}


export default class JdbcDriver<T extends ConnectionType> extends Drivers<T> implements IDrivers {
    protected static connection: any = new Map();
    protected type: T;
    constructor(type: T, config: IConnectionConfig<T>) {
        super(type, config);
        this.type = type;
        if (!jinst.isJvmCreated()) {
            jinst.addOption('-Xrs');
            jinst.setupClasspath([path.join(__dirname, this.driverPath)]);
        }
        const connection = new jdbc(this.get_config())
        JdbcDriver.connection.set(this.type, connection)
    }

    public get_version = () => this.driver.version;
    public findAll = async (tableName: string) => await this.sql(`SELECT * FROM ${tableName}`)
    public count = async (tableName: any) => await this.sql(`SELECT COUNT(*) as total from ${tableName}`)
    public find = async (tableName: string, where: number | string = 1) => await this.sql(`SELECT * FROM ${tableName} WHERE ${where}`)
    public connection_count = () => JdbcDriver.connection.size;
    public connection_details = () => JdbcDriver.connection.entries();

    public get_columns = async (tableName: string) => {
        if (this.type === 'custom') {
            return 'This method is not supported for the custom drivers'
        } else {
            return await this.sql(this.get_query(tableName, QueryType.columns))
        }
    }

    public get_table_properties = async (tableName: string) => {
        if (this.type === 'custom') {
            return 'This method is not supported for the custom drivers'
        } else{
            return await this.sql(this.get_query(tableName, QueryType.describe))
        }
    }

    public sql = async (sql: string) => {
        try {
            const res = this.executeQuery(sql)
            return res
        } catch (err) {
            console.log('Error in sql:::', err)
        }
    }

    public ddl = async (sql: string) => {
        try {
            const res = this.executeUpdate(sql)
            return res
        } catch (err) {
            console.log('Error in ddl:::', err)
        }
    }

    protected close = async (connObj: any) => {
        try {
            const coon = JdbcDriver.connection.get(this.type)
            coon.release(connObj, (err: any) => {
                if (err) console.log('Connection relase issues::::')
                else console.log('Connection relase')
            })
        } catch (err) {
            console.log('Connection close error:::::', err)
        }
    }

    protected executeQuery = async (sql: any) => {
        return new Promise(async (resolve, reject) => {
            const stat: any = await this.createStatement()
            stat[0].executeQuery(sql, async (err: any, resultset: any) => {
                if (err) reject(err)
                else {
                    await resultset.toObjArray((err: any, rows: any) => {
                        if (err) reject(err)
                        else resolve(rows)
                        stat[0].close((err: any) => {
                            if (err) console.log('Statement closing issues...', err)
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

    protected executeUpdate = async (sql: any) => {
        return new Promise(async (resolve, reject) => {
            const stat: any = await this.createStatement()
            stat[0].executeUpdate(sql, async (err: any, count: any) => {
                if (err) reject(err)
                else resolve(count)
                stat[0].close((err: any) => {
                    if (err) console.log('Statement closing issues::::')
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
                conn.createStatement((err: any, statement: any) => {
                    if (err) reject(err)
                    else resolve([statement, connObj])
                })
            } else {
                reject('Connection object not found')
            }
        })
    }

    protected open = async () => {
        return new Promise(async (resolve, reject) => {
            const connection = JdbcDriver.connection.get(this.type)
            if (this.is_init(connection)) {
                resolve(connection._reserved[0])
            } else {
                if (!connection._pool.length) {
                    await this.init(connection)
                }
                connection.reserve((err: any, connObj: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(connObj)
                    }
                })
            }
        })
    }

    protected is_init = (conn: any) => {
        return conn._reserved.length
    }

    protected init = async (connection: any) => {
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
