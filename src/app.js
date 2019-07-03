import express from 'express';
import cors from 'cors';
import passport from 'passport';
import myStrategy from './config/passport';
import users from './routes/user.route'

const app = express();


//Middleware
app.use(cors());
app.use(express.json());
passport.initialize();
passport.use(myStrategy);


app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Index')
});

export default app;