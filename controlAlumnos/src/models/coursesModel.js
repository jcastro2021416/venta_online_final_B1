'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coursesSchema = Schema({
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    asignCourse:{
        type: String,
        require: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref:'Usuarios'
    }]
})

module.exports = mongoose.model('Courses', coursesSchema)
















