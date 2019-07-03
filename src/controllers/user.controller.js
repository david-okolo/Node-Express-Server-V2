import user from '../models/user.model'
import bcrypt from 'bcrypt';


export const addUser = (_newUser, callback)=>{
    bcrypt.hash(_newUser.password, 10, (err, hash)=>{
        _newUser.password = hash;
        user.create(_newUser, callback)
    });
}

export const getUserByUsername = (_username, callback)=>{
    user.findOne({username: _username}, callback)
}

export default {
    addUser,
    getUserByUsername
}