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

const createOptions = (_endpoint)=>{
    return {
        hostname: 'localhost',
        port: 3000,
        path: `/users/${_endpoint}`,
        headers: {
            'content-type':'application/json',
            'accept': 'application/json' 
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

    describe(`Registration`, ()=>{
        it(`should not register bad requests`, (done) => {
            let req = http.request(createOptions('register'), (res) => {
                done()
                res.on('data', (result)=>{
                    result = JSON.parse(result);
                    expect(result.success).to.be.false
                    expect(result.msg).to.equal('user validation failed')
                });
            });
            let body = {
                name: "root"
            }
            req.write(JSON.stringify(body));
            req.end();
        })

        it('should register new user request',(done)=>{
            let req = http.request(createOptions('register'), (res)=>{
                done();
                res.on('error', (err)=>{
                    console.log('Err: ' +err);
                });
                res.on('data', (result)=>{
                    result = JSON.parse(result);
                    expect(result.data).to.contain.property('_id');
                    expect(result.data).to.contain.property('username');
                    expect(result.data).to.contain.property('password');
                    expect(result.data).to.contain.property('email');
                    expect(result.success).to.be.true
                });
            });
            req.write(JSON.stringify(createUser()));
            req.end();
        });  

        it(`should not register an existing account with the same email or username`, (done)=>{
            let req = http.request(createOptions('register'), (res)=>{
                done();
                res.on('error', (err) => {
                    console.log(err)
                });
                res.on('data', (result)=>{
                    result = JSON.parse(result);
                    expect(result.success).to.equal(false)
                    expect(result.msg).to.equal('email already exists' || 'username already exists')
                })
            });
            req.write(JSON.stringify(createUser()));
            req.end();
        })
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