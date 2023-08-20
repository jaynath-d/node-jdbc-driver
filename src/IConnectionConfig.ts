interface OptionalConfig{
    minpoolsize?: number;
    maxpoolsize?: number;
}
export interface BaseConfig extends OptionalConfig{
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface SQLiteConfig extends OptionalConfig{
    path: string;
}

type IConnectionConfig<T> = T extends 'S' ? SQLiteConfig : BaseConfig 

export default IConnectionConfig
