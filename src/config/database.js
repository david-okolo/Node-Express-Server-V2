import mongoose from 'mongoose';

const dbconnect = (_url) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(_url, {useNewUrlParser: true})
        .then(() => {
            resolve('connected')
        },(err)=> {
            reject(err)
        });
    });

}

const dbclose = ()=> mongoose.disconnect();

export {dbconnect, dbclose}