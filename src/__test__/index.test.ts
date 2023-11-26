import JdbcDriver, { ConnectionType } from '../index';
import { QueryType } from '../IDatabase';
import IConnectionConfig from '../IConfig';

// Mocking dependencies
jest.mock('jdbc');
jest.mock('jdbc/lib/jinst');

describe('JdbcDriver', () => {
  let jdbcDriver: any;

  beforeEach(() => {
    const config: IConnectionConfig<ConnectionType> = {
      path: '/Users/username/Downloads/demo',
    };

    jdbcDriver = new JdbcDriver(ConnectionType.sqlite, config);
  });

  describe('Common Tests', () => {
    it('should create a JdbcDriver instance', () => {
      expect(jdbcDriver).toBeInstanceOf(JdbcDriver);
    });

    it('should get the version of the driver', () => {
      const version = jdbcDriver.get_version();
      expect(version).toBeDefined();
    });

    it('should handle errors in sql method', async () => {
      const errorMessage = 'Error executing query';
      jdbcDriver.executeQuery = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(jdbcDriver.sql('SELECT * FROM exampleTable')).rejects.toThrowError(errorMessage);
    });

    it('should handle errors in ddl method', async () => {
      const errorMessage = 'Error executing ddl';
      jdbcDriver.executeUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(jdbcDriver.ddl('CREATE TABLE exampleTable (id INT)')).rejects.toThrowError(errorMessage);
    });

    it('should handle custom driver for get_columns', async () => {
      jdbcDriver = new JdbcDriver(ConnectionType.custom, {
        jars: 'sqlite-jdbc-3.7.2.jar',
        driverClass: 'org.sqlite.JDBC',
        jdbcUrl: 'jdbc:sqlite:/Users/jaynathray/Downloads/demo',
      });
      const result = await jdbcDriver.get_columns('exampleTable');

      expect(result).toBe('This method is not supported for the custom drivers');
    });

    it('should get the connection count', () => {
      const count = jdbcDriver.connection_count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should get the connection details', async () => {
      const result = await jdbcDriver.connection_details();
      expect(result).not.toBeNull();
    });
  });

  describe('Table Operation Tests', () => {
    it('should find all records in a table', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ id: 1, name: 'Example' }];
      jdbcDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await jdbcDriver.findAll(tableName);

      expect(jdbcDriver.sql).toHaveBeenCalledWith(`SELECT * FROM ${tableName}`);
      expect(result).toEqual(mockResult);
    });

    it('should count records in a table', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ total: 5 }];
      jdbcDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await jdbcDriver.count(tableName);

      expect(jdbcDriver.sql).toHaveBeenCalledWith(`SELECT COUNT(*) as total from ${tableName}`);
      expect(result).toEqual(mockResult);
    });

    it('should find records with a condition in a table', async () => {
      const tableName = 'exampleTable';
      const whereCondition = 'id = 1';
      const mockResult = [{ id: 1, name: 'Example' }];
      jdbcDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await jdbcDriver.find(tableName, whereCondition);

      expect(jdbcDriver.sql).toHaveBeenCalledWith(`SELECT * FROM ${tableName} WHERE ${whereCondition}`);
      expect(result).toEqual(mockResult);
    });

    it('should get columns for a table', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ columnName: 'id', dataType: 'int' }];
      jdbcDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await jdbcDriver.get_columns(tableName);

      expect(jdbcDriver.sql).toHaveBeenCalledWith(jdbcDriver.get_query(tableName, QueryType.columns));
      expect(result).toEqual(mockResult);
    });

    it('should get table properties', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ propertyName: 'prop', propertyValue: 'value' }];
      jdbcDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await jdbcDriver.get_table_properties(tableName);

      expect(jdbcDriver.sql).toHaveBeenCalledWith(jdbcDriver.get_query(tableName, QueryType.describe));
      expect(result).toEqual(mockResult);
    });
  });

  describe('Hive Driver Tests', () => {
    let hiveDriver: any;

    beforeEach(() => {
      const hiveConfig: IConnectionConfig<ConnectionType.hive> = {
        host: 'localhost',
        port: 10000,
        database: 'exampleTable',
      };
      hiveDriver = new JdbcDriver(ConnectionType.hive, hiveConfig);
    });

    it('should create a JdbcDriver instance for Hive', () => {
      expect(hiveDriver).toBeInstanceOf(JdbcDriver);
    });

    it('should get columns for a table', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ columnName: 'id', dataType: 'int' }];
      hiveDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await hiveDriver.get_columns(tableName);

      expect(hiveDriver.sql).toHaveBeenCalledWith(hiveDriver.get_query(tableName, QueryType.columns));
      expect(result).toEqual(mockResult);
    });

    it('should get table properties', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ propertyName: 'prop', propertyValue: 'value' }];
      hiveDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await hiveDriver.get_table_properties(tableName);

      expect(hiveDriver.sql).toHaveBeenCalledWith(hiveDriver.get_query(tableName, QueryType.describe));
      expect(result).toEqual(mockResult);
    });

    // Add more Hive-specific test cases as needed
  });

  describe('PostgreSQL Driver Tests', () => {
    let postgresDriver: any;

    beforeEach(() => {
      const postgresConfig: IConnectionConfig<ConnectionType.postgreSql> = {
        host: 'localhost',
        port: 10000,
        database: 'exampleTable',
      };
      postgresDriver = new JdbcDriver(ConnectionType.postgreSql, postgresConfig);
    });

    it('should create a JdbcDriver instance for PostgreSQL', () => {
      expect(postgresDriver).toBeInstanceOf(JdbcDriver);
    });

    it('should get columns for a table', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ columnName: 'id', dataType: 'int' }];
      postgresDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await postgresDriver.get_columns(tableName);

      expect(postgresDriver.sql).toHaveBeenCalledWith(postgresDriver.get_query(tableName, QueryType.columns));
      expect(result).toEqual(mockResult);
    });

    it('should get table properties', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ propertyName: 'prop', propertyValue: 'value' }];
      postgresDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await postgresDriver.get_table_properties(tableName);

      expect(postgresDriver.sql).toHaveBeenCalledWith(postgresDriver.get_query(tableName, QueryType.describe));
      expect(result).toEqual(mockResult);
    });

    // Add more PostgreSQL-specific test cases as needed
  });

  describe('Tibero Driver Tests', () => {
    let tiberoDriver: any;

    beforeEach(() => {
      const tiberoConfig: IConnectionConfig<ConnectionType.tibero> = {
        host: 'localhost',
        port: 10000,
        database: 'exampleTable',
        username: 'root',
        password: 'admin',
        maxpoolsize: 5,
        minpoolsize: 5,
      };
      tiberoDriver = new JdbcDriver(ConnectionType.tibero, tiberoConfig);
    });

    it('should create a JdbcDriver instance for Tibero', () => {
      expect(tiberoDriver).toBeInstanceOf(JdbcDriver);
    });

    it('should get columns for a table', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ columnName: 'id', dataType: 'int' }];
      tiberoDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await tiberoDriver.get_columns(tableName);

      expect(tiberoDriver.sql).toHaveBeenCalledWith(tiberoDriver.get_query(tableName, QueryType.columns));
      expect(result).toEqual(mockResult);
    });

    it('should get table properties', async () => {
      const tableName = 'exampleTable';
      const mockResult = [{ propertyName: 'prop', propertyValue: 'value' }];
      tiberoDriver.sql = jest.fn().mockResolvedValue(mockResult);

      const result = await tiberoDriver.get_table_properties(tableName);

      expect(tiberoDriver.sql).toHaveBeenCalledWith(tiberoDriver.get_query(tableName, QueryType.describe));
      expect(result).toEqual(mockResult);
    });

    // Add more Tibero-specific test cases as needed
  });
});
