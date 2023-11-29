const { AutoIncrementID } = require("@typegoose/auto-increment");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const admitSchema = new mongoose.Schema({
    _id: Number,
    patientId: {
        type: Number,
        ref: "Patient"
    },
    admitDate: {
        type: Date,
        default: Date.now()
    },
    dischargeDate: {
        type: Date,
        required: false
    },
    isDischarged: {
        type: "boolean",
        default: false
    },
    temperatures: [
        {
            date: Date,
            time: String,
            temp: Number,
            heartrate: Number,
            vomiting: String,
            urine: String
        }
    ],
    drSheet: [
        {
            date: Date,
            note: String,
            treatment: String
        }
    ],
    drugChart: [
        {
            
            date: Date,
            dose: String,
            drug: String,
            frequency: String,
            instruction: String,
            route: String,
            time: String,

        }
    ]
  
});

admitSchema.plugin(AutoIncrementID, {});

const Admit = mongoose.model("Admit", admitSchema);

module.exports = Admit;
