type MakeNever<T> = {
    [K in keyof T]?: never;
};

interface OptionalConfig{
    minpoolsize?: number;
    maxpoolsize?: number;
}

interface AuthConfig extends OptionalConfig{
    username?: string;
    password?: string;
}

interface JDBCConfig{
    jdbcUrl: string;
}

interface HostConfig extends AuthConfig{
    host: string;
    port: number;
    database: string;
}

interface PathConfig extends OptionalConfig{
    path: string;
}

type H = MakeNever<JDBCConfig> & HostConfig
type J = MakeNever<HostConfig> & JDBCConfig

export type BaseConfig = H | J

export interface SQLiteConfig extends OptionalConfig{
    path: string;
}

export interface CustomDriverConfig extends Partial<HostConfig>, Partial<SQLiteConfig>, Partial<JDBCConfig>{
    jars: string,
    driverClass: string
};

type IConnectionConfig<T> =
    T extends 'S' ? SQLiteConfig :
    T extends 'C' ? CustomDriverConfig :
    BaseConfig; 

export default IConnectionConfig
