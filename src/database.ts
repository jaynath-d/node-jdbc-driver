import {db, DriverType,DriverConfig,  QueryType } from './IDatabase';
import { BaseConfig } from './IConfig';


export default class DatabaseDriver implements DriverType {
    protected config: BaseConfig;
    public driver: DriverConfig;
    public driverPath: string;

    constructor(type: any, config: BaseConfig) {
        this.config = config
        this.driver = db.getDriver(type)
        this.driverPath = db.getJar(type)
    }

    public get_config = () => {
        return {
            url: this.get_jdbcUrl(),
            drivername: this.driver.className,
            ...(this.config.username && { user: this.config.username }),
            ...(this.config.password && { password: this.config.password }),
            ...(this.config.minpoolsize && { minpoolsize: this.config.minpoolsize }),
            ...(this.config.maxpoolsize && { maxpoolsize: this.config.maxpoolsize }),
        }
    }

    public get_query = (tableName: string, type: string = 'D') => {
        if (QueryType.columns == type) {
            return this.driver.query.columns(tableName)
        } else {
            return this.driver.query.describe(tableName)
        }
    }

    protected get_jdbcUrl = () => {
        if (this.config.jdbcUrl) {
            return this.config.jdbcUrl
        }else if(this.config.path){
            return `jdbc:${this.driver.connectionType}://${this.config.path}`
        } else {
            const { host, port, database, } = this.config
            if (this.driver.connectionType == 'tibero:thin') {      // is this tibero
                return `jdbc:${this.driver.connectionType}:@${host}:${port}:${database}`;
            } else {                                                // etc
                return `jdbc:${this.driver.connectionType}://${host}:${port}/${database}`;
            }
        }
    }

    protected set_driver(driver: DriverConfig){
        this.driver = driver
    }

    protected set_driver_path(path: string){
        this.driverPath = path
    }
}
