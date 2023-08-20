
import IConnectionType, { QueryType } from '../IConnectionType';
import {SQLiteConfig} from '../IConnectionConfig';

export default class Sqlite implements IConnectionType{
    protected config: SQLiteConfig;
    protected driverName:string = 'sqlite';
    protected driverClassName:string = 'org.sqlite.JDBC';
    protected driverVersion:string = '3.7.2';
    public driver: string = `${this.driverName}-jdbc-${this.driverVersion}.jar`;
    constructor(config: SQLiteConfig) {
        this.config = config
    }

    public get_config = () => {
        return {
            url: this.get_jdbcUrl(),
            drivername: this.driverClassName,
            ...(this.config.minpoolsize && {minpoolsize: this.config.minpoolsize}),
            ...(this.config.maxpoolsize && {maxpoolsize: this.config.maxpoolsize}),
        }
    }

    public get_query = (tableName:string, type:string = 'D') => {
        return `PRAGMA table_info(${tableName})`
    }

    public get_version = () => this.driverVersion;

    protected get_jdbcUrl = () => {
        return `jdbc:${this.driverName}://${this.config.path}`;
    }
}
