<div align="center">
	<h1>Node JDBC Driver</h1> 
	<br>
	<p>node-jdbc-driver is a JDBC API wrapper for Node.js, providing methods to manage database connections, execute queries and update statements, and retrieve database information such as table and column structures in a database-independent manner.</p>
<!-- 	<a href="https://packagephobia.now.sh/result?p=node-jdbc-driver"><img src="https://badgen.net/packagephobia/install/node-jdbc-driver" alt="Bundle size"></a> -->
	<a href="https://img.shields.io/badge/dependencies-up--to--date-brightgreen.svg"><img src="https://img.shields.io/badge/dependencies-up--to--date-brightgreen.svg" alt="Dependencies upto date"></a>
	<a href="https://img.shields.io/badge/status-stable-brightgreen.svg"><img src="https://img.shields.io/badge/status-stable-brightgreen.svg" alt="Status"></a>
	<a href="https://www.npmjs.com/package/node-jdbc-driver"><img src="https://img.shields.io/npm/dw/node-jdbc-driver" alt="Downloads"></a>
	<a href="https://www.npmjs.com/package/node-jdbc-driver"><img src="https://img.shields.io/npm/v/node-jdbc-driver" alt="Npm version"></a><br />
	<a href="mail-pcode027@gmail.com"><img src="https://img.shields.io/badge/author-pcode027@gmail.com-blue.svg" alt="Author"></a>
</div>

---

<!-- DOC -->
- [Features](#features)
- [Installation](#installation)
- [Loading and configuring the module](#loading-and-configuring-the-module)
- [Common Usage](#common-usage)
<!-- /DOC -->

## Features
- **Simplified JDBC Usage**: Provides an intuitive API to manage JDBC database connections, execute queries, and handle update statements, abstracting away low-level complexities.

- **Multiple Database Support**: Seamlessly connect to different types of databases, including Hive, PostgreSQL, Tibero, and SQLite, with a unified interface.

- **Flexible Configuration**: Easily configure database connections using either host, port, database name, username, and password or via custom JDBC connection with driver jars and connection URLs.

- **Connection Pooling**: Benefit from built-in connection pooling support to efficiently manage and reuse database connections, enhancing application performance.

- **Query Execution**: Execute custom SQL queries and retrieve results in a straightforward manner, enabling you to interact with your database effortlessly.

- **Database Structure Information**: Retrieve comprehensive information about table and column structures using simple methods, enabling you to work with your database schema efficiently.

- **Data Manipulation**: Perform essential data manipulation tasks such as counting rows, finding rows based on criteria, retrieving all rows from a table, and more.

- **Data Definition Language (DDL) Support**: Execute DDL queries to manage the structure of your database, including creating and altering tables, views, and indexes.


## Installation
To install the package, use the following command:
```sh
npm install --save node-jdbc-driver
```

### Loading and configuring the module
You can initialize the JDBC driver using either CommonJS or ES6 syntax:
```javascript
// CommonJS
const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver");

// ES6
import JdbcDriver, { ConnectionType } from 'node-jdbc-driver';
```


## Common Usage
Below are some minimal usage examples demonstrating how to use the `node-jdbc-driver` package.

### Connection Setup
For different types of databases, you need to provide specific connection details.

#### Available Connection types
```javascript
ConnectionType.hive // for hive connection
ConnectionType.postgreSql // for postgreSql connection
ConnectionType.sqlite // for sqlite connection
ConnectionType.tibero // for tibero connection
ConnectionType.custom // Establish a JDBC connection using a custom driver
```

#### Hive and PostgreSQL Connection
For Hive and PostgreSQL connections, provide the host, port, database name, username, and password:
```javascript
const host = '<host>';
const port = '<port>';
const database = '<database_name>';
const username = '<username>';
const password = '<password>';

// Set optional parameters
const minpoolsize = '<min_pool_size>'
const maxpoolsize = '<max_pool_size>'

// For Hive
const jdbc = new JdbcDriver(ConnectionType.hive, { host, port, database, username, password });

// For Hive with connection url
const jdbcUrl = 'jdbc:hive2://<host>:<port>/<database>'
const jdbc = new JdbcDriver(ConnectionType.hive, { jdbcUrl, username, password });

// For PostgreSql
const jdbc = new JdbcDriver(ConnectionType.postgreSql, { host, port, database, username, password });

// For PostgreSql with connection url
const jdbcUrl = 'jdbc:postgresql://<host>:<port>/<database>'
const jdbc = new JdbcDriver(ConnectionType.postgreSql, { jdbcUrl, username, password });

// For tibero connection
const jdbc = new JdbcDriver(ConnectionType.tibero, { host, port, database, username, password });
```
#### SQLite Connection
For SQLite connections, provide the path to the SQLite database file:
```javascript
const path = '<db_path>';

// Set optional parameters
const minpoolsize = '<min_pool_size>'
const maxpoolsize = '<max_pool_size>'

const jdbc = new JdbcDriver(ConnectionType.sqlite, { path });
```

#### JDBC Connection using custom driver
```javascript
 const jdbc = new JdbcDriver(ConnectionType.custom, {
        jars: 'sqlite-jdbc-3.7.2.jar', // local path of your jar file
        driverClass: 'org.sqlite.JDBC', // Driver class of your jar file
        jdbcUrl: 'jdbc:sqlite:/Users/jaynathray/Downloads/demo' // use jdbc url for connection
})
```

```javascript
 const jdbc = new JdbcDriver(ConnectionType.custom, {
        jars: 'sqlite-jdbc-3.7.2.jar', // local path of your jar file
        driverClass: 'org.sqlite.JDBC', // Driver class of your jar file
        path: '/Users/jaynathray/Downloads/demo' // use path for connection
})
```

## Basic Operations
Here are some basic operations you can perform using the `node-jdbc-driver`:

### Check Driver Version
You can check the driver version using the following method:
```javascript
const version = jdbc.get_version();
```

### Count Example
To count the number of rows in a table:
```javascript
const total = await jdbc.count('<table_name>');
```

### Find Example
To find a single row based on a WHERE clause:
```javascript
const row = await jdbc.find('<table_name>', '<where_clause>');
```

### Find All Example
To retrieve all rows from a table:
```javascript
const rows = await jdbc.findAll('<table_name>');
```

### SQL Query Example
To execute a custom SQL query:
```javascript
const results = await jdbc.sql('<sql_query>');
```

### DDL Example
To execute Data Definition Language (DDL) queries:
```javascript
const results = await jdbc.ddl('<sql_query>');
```

### List Table Columns
To retrieve information about table columns:
```javascript
const columns = await jdbc.get_columns('<table_name>');
```

### Describe Table Properties
To get properties of a table:
```javascript
const tblProperties = await jdbc.get_table_properties('<table_name>');
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
