import express from 'express';
import cors from 'cors';
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



// app.listen(config.port, ()=>{
//     console.log('Started on port '+config.port)
// });

app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Index')
});

export default app;