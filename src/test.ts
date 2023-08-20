import JdbcDriver, { ConnectionType } from './index';

// Set the connection details for the Hive and postgreSql
const host = '<host>';
const port = 0; // <port>
const database = '<database_name>';
const username = '<username>';
const password = '<password>';

// Set the connection details for the sqlite
const path = '<db_path>'

// Set optional parameters
const minpoolsize = '<min_pool_size>'
const maxpoolsize = '<max_pool_size>'

// Available Connection types
ConnectionType.hive // for hive connection
ConnectionType.postgreSql // for postgreSql connection
ConnectionType.sqlite // for sqlite connection



const get_count = async () => {
    // const hive = new JdbcDriver(ConnectionType.hive, {host, port, database, username, password})
    const jdbc = new JdbcDriver(ConnectionType.sqlite, {path: '/Users/username/Downloads/demo'})
    const count = await jdbc.count('test')
    console.log('total count:', count)
}

get_count()
