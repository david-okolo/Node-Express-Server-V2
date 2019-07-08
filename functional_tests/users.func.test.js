import http from 'http';
import 'chai/register-expect';
import { MongoMemoryServer } from 'mongodb-memory-server'
import {dbconnect, dbclose} from '../src/config/database'
import app from '../src/app'

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

describe('Users API tests', ()=>{

    before((done)=>{
        mongoServer = new MongoMemoryServer();
        mongoServer.getConnectionString()
        .then((mongoUri)=>{
            dbconnect(mongoUri).then((resolve)=>{
                console.log('------------------' + 'Database '+resolve + '-----------------');
                server = app.listen(3000);
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
                let request = http.request(createOptions('register'), (response) => {
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.be.false
                        expect(result.msg).to.equal('user validation failed');
                        done();
                    });
                });
                let body = {
                    name: "root"
                }
                request.write(JSON.stringify(body));
                request.end();
            })
    
            it('should register new user request',(done)=>{
                let request = http.request(createOptions('register'), (response)=>{
                    
                    response.on('error', (err)=>{
                        console.log('Err: ' +err);
                        done();
                    });
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.data).to.contain.property('_id');
                        expect(result.data).to.contain.property('username');
                        expect(result.data).to.contain.property('password');
                        expect(result.data).to.contain.property('email');
                        expect(result.success).to.be.true
                        done();
                    });
                });
                request.write(JSON.stringify(createUser()));
                request.end();
            });  
    
            it(`should not register an existing account with the same email or username`, (done)=>{
                let request = http.request(createOptions('register'), (response)=>{
                    
                    response.on('error', (err) => {
                        console.log(err)
                        done();
                    });
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.equal(false)
                        expect(result.msg).to.equal('email already exists' || 'username already exists')
                        done();
                    })
                });
                request.write(JSON.stringify(createUser()));
                request.end();
            })
        });
    
        describe(`Authentication`, ()=>{
            it(`should reject bad request`, (done)=>{
                let request = http.request(createOptions('authenticate'), (response)=>{
                    
                    response.on('error', (err)=>{
                        console.log(err)
                        done();
                    })
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.be.false;
                        expect(result.msg).to.equal('bad request');
                        done();
                    });
                });
    
                let body = {
                    name: 'Cookie'
                }
                request.write(JSON.stringify(body));
                request.end();
            });
    
            it(`should accept and authenticate correct username`, (done)=>{
                let request = http.request(createOptions('authenticate'), (response)=>{
                    
                    response.on('error', (err)=>{
                        console.log(err)
                        done();
                    });
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.be.true;
                        expect(result.data).to.contain.property('token');
                        done();
                    });
                });
                
                request.write(JSON.stringify(createLogin()));
                request.end()
            });
    
            it(`should accept and authenticate correct email`, (done)=>{
                
                let request = http.request(createOptions('authenticate'), (response)=>{
                    response.on('error', (err)=>{
                        console.log(err)
                        done()
                    });
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.be.true;
                        expect(result.data).to.contain.property('token');
                        done();
                    });
                });
                request.write(JSON.stringify(createLogin(email)));
                request.end();
            });
    
            it(`should reject authentication with wrong password`, (done)=>{
                let request = http.request(createOptions('authenticate'), (response)=>{
                    response.on('error', (err)=>{
                        console.log(err)
                        done()
                    });
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.be.false;
                        expect(result.msg).to.equal('wrong password')
                        done();
                    });
                });
                request.write(JSON.stringify(createLogin(email, 'freak')));
                request.end();
            });
    
            it(`should return user not found`, (done)=>{
                let request = http.request(createOptions('authenticate'), (response)=>{
                    response.on('error', (err)=>{
                        console.log(err)
                        done()
                    });
                    response.on('data', (result)=>{
                        result = JSON.parse(result);
                        expect(result.success).to.be.false;
                        expect(result.msg).to.equal('user doesn\'t exist');
                        done();
                    });
                });
                request.write(JSON.stringify(createLogin('drake@icloud.com')));
                request.end();
            });
        });
    })

    after((done)=>{
        dbclose().then(()=>{
            server.close()
            console.log('------------------' + 'Database disconnected' + '-----------------');
            process.exit(0)
            done();
        })
    })
})