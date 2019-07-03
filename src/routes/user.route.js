import UserController from '../controllers/user.controller';
import express from 'express';

function isEmail(_query){
    let patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return patternEmail.test(_query);
}

const router = express.Router();

router.post('/register', (req, res)=>{
    let newUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }

    UserController.getUserByEmail(newUser.email, (err, user)=>{
        if(err){
            res.json({
                success: false,
                msg: err._message
            })
        } 

        if(!user){

            UserController.getUserByUsername(newUser.username, (err, user)=>{
                if(err){
                    res.json({
                        success: false,
                        msg: err._message
                    })
                }

                if(!user){

                    UserController.addUser(newUser, (err, user)=>{
                        if (err) res.status(500).json({
                            success: false,
                            msg: err._message
                        })
                
                        if(user){
                            res.status(200).json({
                                success: true,
                                data: user,
                                msg: "succesfully added"
                            })
                        }
                    });

                }else{

                    res.status(402).json({
                        success: false,
                        msg: 'username already exists'
                    })
                    
                }


            })
            
        }else{
            res.status(402).json({
                success: false,
                msg: 'email already exists'
            })
        }

    })
});

router.post('/authenticate', (req, res)=>{

    if(req.body.usernameOrEmail != undefined && req.body.password != undefined){

        let login = {
            usernameOrEmail: req.body.usernameOrEmail,
            password: req.body.password 
        }
    
        if(isEmail(login.usernameOrEmail)){
            user.getUserByEmail(login.usernameOrEmail, (err, user)=>{
                if(err){
                    res.json({
                        success: false
                    })
                }
            })
        }

    } else {
        res.json({
            success: false,
            msg: 'bad request'
        });
    }
    


})

export default router;