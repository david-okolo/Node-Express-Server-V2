import user from '../models/user.model'

export const addUser = (_newUser, callback)=>{
    user.create(_newUser, callback)
}

export const getUserById = (_id, callback)=>{
    user.findOne({_id: _id}, callback)
}

export default {
    addUser,
    getUserById
}