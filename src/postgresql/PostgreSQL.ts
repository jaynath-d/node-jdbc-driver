
import IConnectionType, { QueryType } from '../IConnectionType';
import {BaseConfig} from '../IConnectionConfig';

export default class PostgreSQL implements IConnectionType{
    protected config: BaseConfig;
    protected driverName:string = 'org.postgresql.Driver';
    protected driverVersion:string = '42.6.0';
    public driver: string = `postgresql-${this.driverVersion}.jar`;
    constructor(config: BaseConfig) {
        this.config = config
    }

    public get_config = () => {
        return {
            url: this.get_jdbcUrl(),
            drivername: this.driverName,
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
        }else{
            const {host, port, database, } = this.config
            return `jdbc:postgresql://${host}:${port}/${database}`;
        }
    }
}
