// Created connection type interface
export default interface IDrivers {
    find: (tableName: string, where: number|string) => object;
    findAll: (tableName:string) => object;
    count: (tableName:string) => object;
    sql: (sql:string) => object;
    get_version: () => string;
    get_columns: (tableName:string) => object;
    get_table_properties: (tableName:string) => object;
}
