import UserController from '../controllers/user.controller';
import express from 'express';

const router = express.Router();

router.post('/register', (req, res)=>{
    let user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }
    UserController.addUser(user, (err, user)=>{
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
})

export default router;