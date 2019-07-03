import config from '../../config';
import User from '../models/user.model'
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey: config.secret
}

const myStrategy = new JWTstrategy(opts, (jwt_payload, done)=>[
    User.findOne({_id: jwt_payload.sub}, (err, user)=>{
        if(err) {
            return done(err, false)
        }
        
        return user ? done(null, user) : done(null, false)
    })
])

export default myStrategy