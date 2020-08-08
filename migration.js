const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE||'./database.sqlite');

db.run('CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY NOT NULL ,name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL)');
