// Created database interface

enum QueryType {
    columns = 'C',
    describe = 'D'
}

interface QueryConfig {
    columns: (tableName: string) => string;
    describe: (tableName: string) => string;
}

interface DriverConfig {
    jar: string;
    connectionType: string;
    className: string;
    version: string;
    query: QueryConfig;
}

interface DatabaseConfig {
    driverPath: string;
    hive: DriverConfig;
    postgresql: DriverConfig;
    sqlite: DriverConfig;
    tibero: DriverConfig;
    getJar: (type: keyof DatabaseConfig) => string;
    getDriver: (type: keyof DatabaseConfig) => DriverConfig;
}

interface DriverType {
    driver: DriverConfig;
    get_config: () => object;
    get_query: (tableName: string, type: string) => string;
}

const db: DatabaseConfig = {
    driverPath: '../drivers/',
    hive: {
        jar: 'hive-jdbc-uber-2.6.3.0-235.jar',
        connectionType: 'hive2',
        className: 'org.apache.hive.jdbc.HiveDriver',
        version: '2.6.3.0-235',
        query: {
            columns: tableName => `DESCRIBE ${tableName}`,
            describe: tableName => `SHOW tblproperties ${tableName}`,
        }
    },
    postgresql: {
        jar: 'postgresql-42.6.0.jar',
        connectionType: 'postgresql',
        className: 'org.postgresql.Driver',
        version: '42.6.0',
        query: {
            columns: tableName => `SELECT column_name as col_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}'`,
            describe: tableName => `SELECT count(*) as total_rows, pg_size_pretty( pg_total_relation_size('${tableName}') ) as total_size;`,
        }
    },
    sqlite: {
        jar: 'sqlite-jdbc-3.7.2.jar',
        className: 'org.sqlite.JDBC',
        connectionType: 'sqlite',
        version: '3.7.2',
        query: {
            columns: tableName => `PRAGMA table_info(${tableName})`,
            describe: tableName => `PRAGMA table_info(${tableName})`,
        }
    },
    tibero: {
        jar: 'tibero7-jdbc.jar',
        className: 'com.tmax.tibero.jdbc.TbDriver',
        connectionType: 'tibero:thin',
        version: '7',
        query: {
            columns: tableName => `DESCRIBE ${tableName}`,
            describe: tableName => `SHOW tblproperties ${tableName}`,
        }
    },
    getJar: function(type) {
        if(this[type]){
            return this.driverPath + (this[type] as DriverConfig).jar;
        }else{
            return ''
        }
    },
    getDriver: function (type) {
        if(this[type]){
            return this[type] as DriverConfig;
        }else{
            return {
                jar: '', 
                className: '', 
                connectionType: '', 
                version: ''
            } as DriverConfig
        }
    }
}

export { db, DriverType, DriverConfig, QueryType}
