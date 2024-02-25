class Exercises{
    constructor(db){
        this.db = db
        this.exercises = this.loadExercises()
    }

    async loadExercises(){
        const sql = 'SELECT * FROM exercise'
        let result = await this.db.query(sql)
        let muscles = {}
        result.forEach(row => {
            row.muscles = JSON.parse(row.muscles)
            muscles[row.id] = row
            delete muscles[row.id].id
        });

        return muscles
    }


    async getMuscles(id){
        return (await this.exercises)[id].muscles
    }

    async getName(id){
        return (await this.exercises)[id].name
    }
}

module.exports = Exercises