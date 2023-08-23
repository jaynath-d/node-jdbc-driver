
import IConnectionType, { QueryType } from '../IConnectionType';
import {CustomDriverConfig} from '../IConnectionConfig';

export default class CustomDriver implements IConnectionType{
    protected config: CustomDriverConfig;
    protected driverName:string;
    protected driverVersion:any;
    protected regex = /(\d+(\.\d+)+-\d+|\d+(\.\d+)+)/;
    public driver: string;
    constructor(config: CustomDriverConfig) {
        this.config = config
        this.driverName = this.config.driverClass.split('.')[1];
        this.driver = this.config.jars
        this.driverVersion = this.driver.match(this.regex)?.[1]
    }

    public get_config = () => {
        return {
            url: this.get_jdbcUrl(),
            drivername: this.config.driverClass,
            ...(this.config.username && {user: this.config.username}),
            ...(this.config.password && {password: this.config.password}),
            ...(this.config.minpoolsize && {minpoolsize: this.config.minpoolsize}),
            ...(this.config.maxpoolsize && {maxpoolsize: this.config.maxpoolsize}),
        }
    }

    public get_query = (tableName:string, type:string = 'D') => {
        if(QueryType.columns == type){
            return `SELECT column_name as col_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}'`
        }else{
            // QueryType.describe
            return `SELECT count(*) as total_rows, pg_size_pretty( pg_total_relation_size('${tableName}') ) as total_size;`
        }
    }

    public get_version = () => this.driverVersion;

    protected get_jdbcUrl = () => {
        if (this.config.jdbcUrl){
            return this.config.jdbcUrl
        }else if(this.config.path){
            return `jdbc:${this.driverName}://${this.config.path}`
        }else{
            const {host, port, database, } = this.config
            return `jdbc:${this.driverName}://${host}:${port}/${database}`;
        }
    }
}
