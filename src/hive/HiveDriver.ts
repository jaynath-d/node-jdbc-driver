import IConnectionType from '../IConnectionType';
import IConnectionConfig from '../IConnectionConfig';

export default class HiveDriver implements IConnectionType{
    protected config: IConnectionConfig;
    protected driverName:string = 'org.apache.hive.jdbc.HiveDriver'
    protected driverVersion:string = '2.6.3.0-235';
    public driver: string = `hive-jdbc-uber-${this.driverVersion}.jar`
    constructor(config: IConnectionConfig) {
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

    protected get_jdbcUrl = () => {
        const {host, port, database, } = this.config
        return `jdbc:hive2://${host}:${port}/${database}`;
    }
}