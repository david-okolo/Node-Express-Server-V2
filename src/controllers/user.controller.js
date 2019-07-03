import user from '../models/user.model'
import bcrypt from 'bcrypt';


const addUser = (_newUser, callback)=>{
    bcrypt.hash(_newUser.password, 10, (err, hash)=>{
        _newUser.password = hash;
        user.create(_newUser, callback)
    });
}

const getUserByUsername = (_username, callback)=>{
    user.findOne({username: _username}, callback)
}

const getUserByEmail = (_email, callback)=>{
    user.findOne({email: _email}, callback)
}

const comparePassword = (_password, _hash, callback)=>{
    bcrypt.compare(_password, _hash, callback)
}


export default {
    addUser,
    getUserByUsername,
    getUserByEmail,
    comparePassword
}