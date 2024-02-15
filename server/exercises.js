class Exercises{
    constructor(db){
        this.db = db
        this.exercises = this.loadExercises()
        this.getMuscles()
    }

    async loadExercises(){
        const sql = 'SELECT * FROM exercise'
        let result = this.db.query(sql)
        // TODO: continue
    }


    async getMuscles(id){
        console.log(await this.exercises)
    }
}

module.exports = Exercises