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

        this.structure = {}
        this.didInitStructure = false
    }

    async query(sql, vars=[], single=false) {
        this.log(3, `sql: ${sql}`)
        this.log(3, `vars: ${vars}`)
        const result = (await this.conn.promise().query(sql, vars))[0]
        this.log(3, `result: ${single ? result[0] : result}`)
        return single ? result[0] : result
    }

    async initStructure(){
        if (this.didInitStructure) return
        
        const sql = `SELECT group_concat(COLUMN_NAME) AS structure, TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'flexify' GROUP BY TABLE_NAME`
        let result = await this.query(sql)
        result.forEach(table => {
            this.structure[table.TABLE_NAME] = table.structure.split(',')
        });
        this.didInitStructure = true

        return true
    }

}

module.exports = DB