const { Schema, model } = require('mongoose')

const userSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            max: 1025,
            min: 6
        },
        karma: {
            type: Number,
            default: 100
        },
        department: {
            type: String,
            required: true
        },
        isTeamLead: {
            type: Boolean,
            default: false
        },
        isStudent: {
            type: Boolean,
            default: true
        },
        isHead: {
            type: Boolean,
            default: false
        }
    }, {
          toObject: {
            virtuals: true,
          },
          toJSON: {
            virtuals: true,
          },
       }
    )


module.exports = model('Model', userSchema)