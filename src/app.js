import express from 'express';
import cors from 'cors';
import passport from 'passport';
import myStrategy from './config/passport';
import config from '../config';
import {connect} from './config/database'
import users from './routes/user.route'

const app = express();


//Connecting to database
// connect(config.databaseURI + `tdd`).then((res)=>{
//     console.log('Database Connected')
// }).catch((err)=>{
//     console.log('Error: '+err)
// })

//Middleware
app.use(cors());
app.use(express.json());
passport.initialize();
passport.use(myStrategy);



// app.listen(config.port, ()=>{
//     console.log('Started on port '+config.port)
// });

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Index')
});

export default app;