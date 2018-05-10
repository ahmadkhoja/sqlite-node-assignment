const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./db/mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database named mydatbase');
});
//selecting all data from database
let sql = `SELECT * FROM movies ORDER BY id`;
db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
});
let id = 6
let name = 'lord of the rings'
let genre = 'action'

//adding new data to the database
sql = `insert into movies ('id','name','genre') values ('`+id+`','`+name+`','`+genre+`')`;
db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
});

//updating existing data in the database
let data = ['Tarazan','Starwars'];
let update_sql = `UPDATE movies
            SET name = ?
            WHERE name = ?`;
 
db.run(update_sql, data, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(update_sql)
  console.log(`Row(s) updated: ${this.changes}`);
});

// deleting data from the database
id = 2;
// delete a row based on id
db.run(`DELETE FROM movies WHERE rowid=?`, id, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) deleted ${this.changes}`);
});

// close the database connection
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
});
