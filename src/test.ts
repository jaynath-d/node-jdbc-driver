import JdbcDriver, { ConnectionType } from './index';

// Set the connection details for the Hive server
const host = '<host>';
const port = 0; // <port>
const database = '<database_name>';
const username = '<username>';
const password = '<password>';



const get_count = async () => {
    const jdbc = new JdbcDriver(ConnectionType.postgreSql, {host, port, database, username, password})
    // const count = await jdbc.sql('SELECT sum(total_rows),sum(compliant_rows), COUNT(total_rows)  from t_krhnz__dz.compliance_stats_spark')
    const count = await jdbc.count('test')
    console.log('total count:', count)
}

get_count()
