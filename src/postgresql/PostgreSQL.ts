
import IConnectionType from '../IConnectionType';
import IConnectionConfig from '../IConnectionConfig';

export default class PostgreSQL implements IConnectionType{
    protected config: IConnectionConfig;
    protected driverName:string = 'org.postgresql.Driver';
    protected driverVersion:string = '42.6.0';
    public driver: string = `postgresql-${this.driverVersion}.jar`;
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
        return `jdbc:postgresql://${host}:${port}/${database}`;
    }
}