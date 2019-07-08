import chaiHttp from 'chai-http';
import {isEmail, createToken} from '../../src/routes/user.route';
// import http from 'http'
import chai from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server'
import {dbconnect, dbclose} from '../../src/config/database'
import app from '../../src/app';

const expect = chai.expect;

chai.use(chaiHttp);



let mongoServer;
let server;

const username = "root"
const password = "password"
const email = "david.okolo@icloud.com"

const createOptions = (_endpoint, _token = null)=>{

    return {
        hostname: 'localhost',
        port: 3000,
        path: `/users/${_endpoint}`,
        headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+_token
        },
        method: 'POST'
    };
}

const createUser = (_name = username, _password = password, _email = email)=>{
    return {
        username: _name,
        password: _password,
        email: _email
    }
}

const createLogin = (_name = username, _password = password)=>{
    return {
        usernameOrEmail: _name,
        password: _password
    }
}

describe(`Users Unit Tests`, ()=>{
    describe(`User helper functions`, ()=>{
        it(`should reject invalid email`, ()=>{
            expect(isEmail('badEmail')).to.be.false;
        })
        it(`should accept valid email`, ()=>{
            expect(isEmail('good@email.com')).to.be.true;
        })
    })
})

describe('Users API Functional tests', ()=>{

    before((done)=>{
        mongoServer = new MongoMemoryServer();
        mongoServer.getConnectionString()
        .then((mongoUri)=>{
            dbconnect(mongoUri).then((resolve)=>{
                done();
            }).catch((err)=>{
                console.log(err);
                done();
            })
        })
    });

    
    describe(`Tests start`, ()=>{
        describe(`Registration`, ()=>{
            it(`should not register bad requests`, (done) => {
                let body = {
                    name: "root"
                }
                chai.request(app)
                .post('/users/register')
                .send(body)
                .then((result)=>{
                   expect(result.body.success).to.equal(false)
                   expect(result.body.msg).to.equal('user validation failed')
                   done()
                })
            })
    
            it('should register new user request',(done)=>{
                chai.request(app)
                .post('/users/register')
                .send(createUser())
                .then((result)=>{
                    expect(result.body.data).to.contain.property('_id');
                    expect(result.body.data).to.contain.property('username');
                    expect(result.body.data).to.contain.property('password');
                    expect(result.body.data).to.contain.property('email');
                    expect(result.body.success).to.be.true
                    done()
                });
                        
            });  
    
            it(`should not register an existing account with the same email or username`, (done)=>{
                chai.request(app)
                .post('/users/register')
                .send(createUser())
                .then((result)=>{
                    expect(result.body.success).to.equal(false)
                    expect(result.body.msg).to.equal('email already exists' || 'username already exists')
                    done();
                });
            });
        });
    
        describe(`Authentication`, ()=>{
            it(`should reject bad request`, (done)=>{
                let body = {
                    name: 'Cookie'
                }

                chai.request(app)
                .post('/users/authenticate')
                .send(body)
                .then((result)=>{
                    expect(result.body.success).to.be.false;
                    expect(result.body.msg).to.equal('bad request');
                    done();
                });
            });
    
            it(`should accept and authenticate correct username`, (done)=>{
                chai.request(app)
                .post('/users/authenticate')
                .send(createLogin())
                .then((result)=>{
                    expect(result.body.success).to.be.true;
                    expect(result.body.data).to.contain.property('token');
                    done();
                });
            });
    
            it(`should accept and authenticate correct email`, (done)=>{
                
                chai.request(app)
                .post('/users/authenticate')
                .send(createLogin(email))
                .then((result)=>{
                    expect(result.body.success).to.be.true;
                    expect(result.body.data).to.contain.property('token');
                    done();
                });
            });
    
            it(`should reject authentication with wrong password`, (done)=>{
                chai.request(app)
                .post('/users/authenticate')
                .send(createLogin(username, "rest"))
                .then((result)=>{
                    expect(result.body.success).to.be.false;
                    expect(result.body.msg).to.equal('wrong password')
                    done();
                });
            });
    
            it(`should return user not found`, (done)=>{
                chai.request(app)
                .post('/users/authenticate')
                .send(createLogin('drake@icloud.com'))
                .then((result)=>{
                    expect(result.body.success).to.be.false;
                    expect(result.body.msg).to.equal(`user doesn't exist`);
                    done();
                });
            });
        });
    })

    after((done)=>{
        dbclose().then(()=>{
            done();
        })
    })
})