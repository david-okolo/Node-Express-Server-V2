import express from 'express';
import http from 'http';
import config from '../../config'

const router = express.Router();

router.post('/sendMessage', (request, response)=>{
    let newMessage = {
        username: request.body.username,
        message: request.body.message
    }

    let opts = {
        hostname: config.aiHostname,
        port: config.aiPort,
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        path: '/messages/sendMessage'
    }

    let serverRequest = http.request(opts, (serverResponse)=>{
        serverResponse.on('error', (error)=>{
            response.json({
                success: false,
                msg: error
            });
        });

        serverResponse.on('data', (data)=>{
            response.json({
                success: true,
                msg: 'successfully fetched',
                data: JSON.parse(data)
            });
        });
    });

    serverRequest.write(JSON.stringify(newMessage));
    serverRequest.end();

});

export default router;