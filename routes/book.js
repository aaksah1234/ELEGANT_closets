const express = require('express');
const meetingRouter = express.Router();
const conn = require('../config/connection');
let authenticate = require('../authenticate');

module.exports = meetingRouter;


//residential meetings

meetingRouter.get('/',authenticate, (req, res, next) => {

    res.render('booking/book');

});

meetingRouter.get('/getEvents', (req, res, next) => {
    var date = new Date();
    var day, month;
    if (date.getDate() < 10) {
        day = `0${date.getDate()}`;
    }
    else {
        day = `${date.getDate()}`;
    }
    if (date.getMonth() < 10) {
        month = `0${date.getMonth() + 1}`;
    }
    else {
        month = `${date.getMonth() + 1}`;
    }
    var s = `${date.getFullYear()}-${month}-${day}`;
    conn.query('DELETE FROM meeting WHERE date<?', [s], function (err, result) {
        if (err) {
            next(err);
        }
        else {
            conn.query('SELECT * FROM meeting',[req.user.id],function (err1, result2) {
                if (err1) {
                    next(err1);
                }
                else {
                    let output = [];
                    result2.forEach(element => {
                        let o = {
                            id: element.id,
                            title: element.category,
                            start: element.date,
                            end: null
                        };
                        console.log(o);
                        output.push(o);
                    });
                    res.json(output);
                }
            });

        }
    });

});

meetingRouter.post('/newMeet', (req, res, next) => {
    conn.query('INSERT INTO meeting (user_id,date,category) VALUES (?,?,?)', [req.user.id, req.body.datetime, req.body.category], (err, result1) => {
        if (err) {
            next(err);
        }
        else {
            // conn.query('SELECT * FROM cart WHERE id=?',[result1.insertId],(err,row)=>{
            //     if(err)next(err);
            //     res.status(201).send({cartItem:row});
            // });
            res.sendStatus(200);

        }
    });
});


meetingRouter.get('/getmeeter/:id', (req, res, next) => {
    
    conn.query('SELECT user_id FROM meeting WHERE id=?',[req.params.id], function (err1, result2) {
        if (err1) {
            next(err1);
        }
        else {
            //console.log(result2);
            if(result2[0].user_id==req.user.id){
                res.sendStatus(200);
            }
            else{
                res.sendStatus(422);
            }
        }
    });

});


meetingRouter.post('/updateMeet', (req, res, next) => {
    conn.query('UPDATE meeting SET category = ? WHERE id = ?', [req.body.title, req.body.meetId], (err, result1) => {
        if (err) {
            next(err);
        }
        else {
            // conn.query('SELECT * FROM cart WHERE id=?',[result1.insertId],(err,row)=>{
            //     if(err)next(err);
            //     res.status(201).send({cartItem:row});
            // });
            res.sendStatus(200);

        }
    });
});


meetingRouter.post('/deleteMeet', (req, res, next) => {
    conn.query('DELETE FROM meeting WHERE id = ?', [req.body.meetId], (err, result1) => {
        if (err) {
            next(err);
        }
        else {
            // conn.query('SELECT * FROM cart WHERE id=?',[result1.insertId],(err,row)=>{
            //     if(err)next(err);
            //     res.status(201).send({cartItem:row});
            // });
            res.sendStatus(200);

        }
    });
});