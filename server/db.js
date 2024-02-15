const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

class DB{
    constructor(log){
        this.log = log
        this.conn = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
              });
        this.conn.connect((err) => {
            if (err) this.log(1, 'Error connecting to MySQL:' + err)
            else     this.log(1, 'Connected to MySQL');
        });
    }

    async query(sql, vars=[], single=false) {
        this.log(3, `sql: ${sql}`)
        this.log(3, `vars: ${vars}`)
        const result = (await this.conn.promise().query(sql, vars))[0]
        this.log(3, `result: ${single ? result[0] : result}`)
        return single ? result[0] : result
    }
}

module.exports = DB