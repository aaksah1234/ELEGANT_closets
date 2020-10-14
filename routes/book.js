const express = require('express');
const meetingRouter = express.Router();
const conn = require('../config/connection');

module.exports = meetingRouter;

meetingRouter.get('/residential', (req, res, next) => {

    res.render('booking/book', { category: 'Residential' });

});


meetingRouter.get('/residential/getEvents', (req, res, next) => {
    var date = new Date();
    var day;
    if (date.getDate() < 10) {
        day = `0${date.getDate()}`;
    }
    else {
        day = `${date.getDate()}`;
    }
    var s = `${date.getFullYear()}-${date.getMonth()}-${day}`;
    conn.query('DELETE FROM meeting WHERE date<? AND category="Residential"', [s], function (err, result) {
        if (err) {
            next(err);
        }
        else {
            conn.query('SELECT * FROM meeting WHERE category="Residential"', function (err1, result2) {
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
                        output.push(o);
                    });
                    res.json(output);
                }
            });

        }
    });

});
meetingRouter.get('/workspace', (req, res, next) => {

    res.render('booking/book', { category: 'Workspace' });

});
meetingRouter.get('/interior', (req, res, next) => {
    conn.query('DELETE FROM meeting WHERE date<? AND category=?', [new Date().getDate()], function (err, result) {
        if (err) {
            next(err);
        }
        else {
            res.render('booking/book', { category: 'Interior' });
        }
    });

});

