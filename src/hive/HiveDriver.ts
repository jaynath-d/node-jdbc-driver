import IConnectionType, { QueryType } from '../IConnectionType';
import { BaseConfig } from '../IConnectionConfig';

export default class HiveDriver implements IConnectionType{
    protected config: BaseConfig;
    protected driverName:string = 'org.apache.hive.jdbc.HiveDriver'
    protected driverVersion:string = '2.6.3.0-235';
    public driver: string = `hive-jdbc-uber-${this.driverVersion}.jar`
    constructor(config: BaseConfig) {
        this.config = config
    }

    public get_config = () => {
        return {
            url: this.get_jdbcUrl(),
            drivername: this.driverName,
            user: this.config.username,
            password: this.config.password
        }
    }

    public get_version = () => this.driverVersion;

    public get_query = (tableName:string, type: string = 'D') => {
        if(QueryType.columns == type){
            return `DESCRIBE ${tableName}`
        }else{
            return `SHOW tblproperties ${tableName}`
        }
    }

    protected get_jdbcUrl = () => {
        const {host, port, database, } = this.config
        return `jdbc:hive2://${host}:${port}/${database}`;
    }
}
