import DatabaseDriver from "./database";
import IConnectionConfig, { BaseConfig, CustomDriverConfig } from './IConfig';

export default class Drivers<T> extends DatabaseDriver{

    protected regex = /(\d+(\.\d+)+-\d+|\d+(\.\d+)+)/;

    constructor(type: T, config: IConnectionConfig<T>){
        super(type, config as BaseConfig);
        console.log(type);
        if(type === 'custom'){
            console.log('Custom driver');
            const _config = config as CustomDriverConfig;
            this.set_driver({
                jar: _config.jars.split('/').pop() || _config.jars,
                className: _config.driverClass,
                connectionType: _config.driverClass.split('.')[1],
                version: _config.jars.match(this.regex)?.[1] || '',
                query:{
                    columns: tableName => '',
                    describe: tableName => '',
                } 
            })
            this.set_driver_path(_config.jars)
        }
    }
}
