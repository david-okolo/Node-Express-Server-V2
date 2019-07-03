import UserController from '../controllers/user.controller';
import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

function isEmail(_query){
    let patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return patternEmail.test(_query);
}

const router = express.Router();

router.post('/register', (request, response)=>{
    let newUser = {
        username: request.body.username,
        password: request.body.password,
        email: request.body.email
    }

    UserController.getUserByEmail(newUser.email, (err, user)=>{
        if(err){
            return response.json({
                success: false,
                msg: err._message
            })
        } 

        if(!user){

            UserController.getUserByUsername(newUser.username, (err, user)=>{
                if(err){
                    return response.json({
                        success: false,
                        msg: err._message
                    })
                }

                if(!user){

                    UserController.addUser(newUser, (err, user)=>{
                        if (err) {
                            return response.status(500).json({
                                success: false,
                                msg: err._message
                            });
                        }
                
                        if(user){
                            response.status(200).json({
                                success: true,
                                data: user,
                                msg: "succesfully added"
                            })
                        }
                    });

                }else{

                    response.status(402).json({
                        success: false,
                        msg: 'username already exists'
                    })
                    
                }


            })
            
        }else{
            response.status(402).json({
                success: false,
                msg: 'email already exists'
            })
        }

    })
});

router.post('/authenticate', (request, response)=>{

    if(request.body.usernameOrEmail != undefined && request.body.password != undefined){

        let login = {
            usernameOrEmail: request.body.usernameOrEmail,
            password: request.body.password 
        }

        const sendToken = (_user)=>{
            UserController.comparePassword(login.password, _user.password, (err, isValid)=>{
                if(err){
                    return response.json({
                        success: false,
                        msg: err
                    })
                }

                if(!isValid){
                    return response.json({
                        success: false,
                        msg: 'wrong password'
                    })
                }else{
                    jwt.sign(JSON.stringify(_user), config.secret, (err, token)=>{
                        if(err){
                            return response.json({
                                success: false,
                                msg: err
                            })
                        }

                        if(!token){
                            response.json({
                                success: false,
                                msg: 'jwt signing failed'
                            });
                        }else{
                            response.json({
                                success: true,
                                msg: 'Authenticated',
                                data: {
                                    token: token
                                }
                            });
                        }
                    });
                }
            });
        }
    
        if(isEmail(login.usernameOrEmail)){
            UserController.getUserByEmail(login.usernameOrEmail, (err, user)=>{
                if(err){
                    return response.json({
                        success: false,
                        msg: err
                    })
                }

                if(!user){

                    response.json({
                        success: false,
                        msg: 'user doesn\'t exist'
                    });

                }else {
                    sendToken(user);
                }
            })
        }else{
            UserController.getUserByUsername(login.usernameOrEmail, (err, user)=>{
                if(err){
                    return response.json({
                        success: false,
                        msg: err
                    })
                }

                if(!user){

                    response.json({
                        success: false,
                        msg: 'user doesn\'t exist'
                    });

                }else {
                    sendToken(user);
                }
            })
        }

    } else {
        response.json({
            success: false,
            msg: 'bad request'
        });
    }
    


})

export default router;