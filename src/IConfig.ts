type MakeNever<T> = {
    [K in keyof T]?: never;
};

interface OptionalConfig{
    minpoolsize?: number;
    maxpoolsize?: number;
}

interface Sqlite extends OptionalConfig{
    path: string;
}

interface AuthConfig extends OptionalConfig{
    username?: string;
    password?: string;
}

interface JDBCConfig{
    jdbcUrl: string;
}

interface HostConfig extends AuthConfig, Partial<Sqlite>{
    host: string;
    port: number;
    database: string;
}



type H = MakeNever<JDBCConfig> & HostConfig
type J = MakeNever<HostConfig> & JDBCConfig

export type BaseConfig = H | J 

export type SQLiteConfig = Sqlite | JDBCConfig

// export interface SQLiteConfig extends OptionalConfig{
//     path: string;
// }

export interface CustomDriverConfig extends Partial<HostConfig>, Partial<Sqlite>, Partial<JDBCConfig>{
    jars: string,
    driverClass: string
};

type IConnectionConfig<T> =
    T extends 'sqlite' ? SQLiteConfig :
    T extends 'custom' ? CustomDriverConfig :
    BaseConfig; 

export default IConnectionConfig
