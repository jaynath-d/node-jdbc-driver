# node-jdbc-driver
JDBC API Wrapper for node.js, The API offers methods to open and close database connections, issue query and update statements, and also retrieve information -- such as table and column structure -- in a database-independent way.

## Latest Version
- 1.1.2

## Installation
- Release: ```npm i --save node-jdbc-driver```

## Usage
Some mininal examples are given below.

### Initialize
```javascript
// CommonJS
const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver")
// ES6
import JdbcDriver, { ConnectionType } from 'node-jdbc-driver'

// Set the connection details for the JDBC connection
const host = '<host>';
const port = '<port>';
const database = '<database_name>';
const username = '<username>';
const password = '<password>';

// Choose connection type
ConnectionType.hive // for hive connection
ConnectionType.postgreSql // for postgreSql connection

// Create jdbc connection
const jdbc = new JdbcDriver(ConnectionType.postgreSql, {host, port, database, username, password})

// check driver version
const version = jdbc.get_version()

// count example
const total = await jdbc.count('<table_name>')

// find example
const row = await jdbc.find('<table_name>', '<where_clouse>')

// find all example
const rows = await jdbc.findAll('<table_name>')

// sql example
const results = await jdbc.sql('<sql_query>')

// list table columns
const columns = await jdbc.get_columns('<table_name>')

// describe table properties
const tblproperties = await jdbc.get_table_properties('<table_name>')
```




