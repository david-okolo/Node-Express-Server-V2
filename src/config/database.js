import mongoose from 'mongoose';

const connect = (_url) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(_url, {useNewUrlParser: true})
        .then(() => {
            resolve('connected')
        },(err)=> {
            reject(err)
        });
    });

}

const close = ()=> mongoose.disconnect();

export {connect, close}