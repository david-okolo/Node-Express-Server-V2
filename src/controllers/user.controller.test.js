import 'chai/register-expect';
import mongoose from 'mongoose';
import UserController from './user.controller';
import {connect, close} from '../config/database'
import config from '../../config'

let mockId;

let mockUser = {
    username: 'root',
    password: 'password',
    email: 'david.okolo@icloud.com',
    authLevel: 4
}


describe('User Controller Tests', ()=> {

    beforeEach((done)=>{
        connect(config.databaseURI).then((res)=>{
            console.log('connected')
            done();
        }).catch((err)=>{
            console.log(err)
            done()
        })
    });
    it('Created user', ()=>{
        UserController.addUser(mockUser, (err, user)=>{
            mockId = user._id;
            expect(err).to.be.null;
            expect(user).to.have.all.keys('_id', 'username', 'password', 'email', 'authLevel')
        })
    });

    it('Found user with id', ()=>{
        UserController.getUserById(mockId, (err, user)=>{
            expect(err).to.be.null;
            expect(user).to.have.all.keys('_id', 'username', 'password', 'email', 'authLevel')
        })
    });

    it('Found user with name', ()=>{
        UserController.getUserById(mockUser.username, (err, user)=>{
            expect(err).to.be.null;
            expect(user).to.have.all.keys('_id', 'username', 'password', 'email', 'authLevel')
        })
    });

    afterEach((done)=>{
        close().then(()=>{
            done();
        })
    })
})