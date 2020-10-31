const express = require('express');
const meetingRouter = express.Router();
const conn = require('../config/connection');

module.exports = meetingRouter;


//residential meetings

meetingRouter.get('/residential', (req, res, next) => {

    res.render('booking/book', { category: 'Residential' });

});


meetingRouter.get('/residential/getEvents', (req, res, next) => {
    var date = new Date();
    var day,month;
    if (date.getDate() < 10) {
        day = `0${date.getDate()}`;
    }
    else {
        day = `${date.getDate()}`;
    }
    if (date.getMonth() < 10) {
        month = `0${date.getMonth()+1}`;
    }
    else {
        month = `${date.getMonth()+1}`;
    }
    var s = `${date.getFullYear()}-${month}-${day}`;
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


// workspace meetings

meetingRouter.get('/workspace', (req, res, next) => {

    res.render('booking/book', { category: 'Workspace' });

});


meetingRouter.get('/workspace/getEvents', (req, res, next) => {
    var date = new Date();
    var day,month;
    if (date.getDate() < 10) {
        day = `0${date.getDate()}`;
    }
    else {
        day = `${date.getDate()}`;
    }
    if (date.getMonth() < 10) {
        month = `0${date.getMonth()+1}`;
    }
    else {
        month = `${date.getMonth()+1}`;
    }
    var s = `${date.getFullYear()}-${month}-${day}`;
    conn.query('DELETE FROM meeting WHERE date<? AND category="Workspace"', [s], function (err, result) {
        if (err) {
            next(err);
        }
        else {
            conn.query('SELECT * FROM meeting WHERE category="Workspace"', function (err1, result2) {
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



//  interior-design meetings

meetingRouter.get('/interior', (req, res, next) => {

    res.render('booking/book', { category: 'Interior' });

});


meetingRouter.get('/interior/getEvents', (req, res, next) => {
    var date = new Date();
    var day,month;
    if (date.getDate() < 10) {
        day = `0${date.getDate()}`;
    }
    else {
        day = `${date.getDate()}`;
    }
    if (date.getMonth() < 10) {
        month = `0${date.getMonth()+1}`;
    }
    else {
        month = `${date.getMonth()+1}`;
    }
    var s = `${date.getFullYear()}-${month}-${day}`;
    conn.query('DELETE FROM meeting WHERE date<? AND category="Interior"', [s], function (err, result) {
        if (err) {
            next(err);
        }
        else {
            conn.query('SELECT * FROM meeting WHERE category="Interior"', function (err1, result2) {
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


