import app from './app';
import {dbconnect, dbclose} from './config/database';
import config from '../config';

dbconnect(config.databaseURI + 'tdd').then((resolve)=>{
    app.listen(config.port, ()=>{
        console.log('started on port '+config.port)
    });
    console.log('Database '+resolve)
}).catch((err)=>{
    console.log(err)
})