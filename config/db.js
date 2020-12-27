const sqlite3 = require('sqlite3').verbose();
// https://levelup.gitconnected.com/learn-basic-operations-with-sqlite-and-nodejs-a693c6fc2e15
// https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4
// https://youtu.be/KyWaXA_NvT0?list=PLillGF-RfqbY3c2r0htQyVbDJJoBFE6Rb&t=2901
// https://blog.pagesd.info/2019/10/08/crud-with-express-sqlite-10-steps/
// open database in memory
let db;

const openDBConnection = () => {
  db = new sqlite3.Database('./transaction.db', (err) => {
    if (err) {
      return console.error(`${err.message}`.red);
    }
    console.log(`Connected to the transaction.db SQlite database.`.green);
  });
  return db;
};

// close the database connection
const closeDBConnection = () => {
  db.close((err) => {
    if (err) {
      return console.error(`${err.message}`.red);
    }
    console.log(`Close the database connection.`.green);
  });
};

const createTable = () => {
  openDBConnection();
  // db.serialize let us run sqlite operations in serial order
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS transactions;`, (err) => {
      if (err) {
        console.log(`${err}`.red);
        throw err;
      }
    });

    // 1rst operation (run create table statement)
    db.run(
      `CREATE TABLE IF NOT EXISTS transactions(id INTEGER PRIMARY KEY AUTOINCREMENT, text Text NOT NULL, amount REAL NOT NULL, createdAt TEXT default (datetime('now')))`,
      (err) => {
        if (err) {
          console.log(`${err}`.red);
          throw err;
        }
      }
    );

    // 2nd operation (insert into transactions table statement)
    db.run(
      `INSERT INTO transactions(text,amount)
              VALUES('Flower',-20),
                    ('Salary',342.340),('Book',-10),('Camera',250)`,
      (err) => {
        if (err) {
          console.log(`${err}`.red);
          throw err;
        }
      }
    );
  });
  closeDBConnection();
};

const getAll = (callback) => {
  openDBConnection();

  let sql = `SELECT * FROM transactions`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });

  closeDBConnection();
};

const addTransaction = (body, callback) => {
  openDBConnection();

  const { text, amount } = body;
  const self = this;
  db.run(
    `INSERT INTO transactions(text,amount) VALUES('${text}',${amount})`,
    function (err) {
      if (err) {
        console.log(`${err}`.red);
        throw err;
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      const transaction = {
        id: this.lastID,
        text,
        amount,
      };
      callback(transaction);
    }
  );

  closeDBConnection();
};

const deleteTransaction = (id, callback) => {
  openDBConnection();
  const self = this;

  db.run(`DELETE FROM transactions WHERE id=?`, id, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted ${this.changes}`);
    callback(this.changes);
  });

  closeDBConnection();
};

module.exports = { createTable, getAll, addTransaction, deleteTransaction };
