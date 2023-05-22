const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema

const ReservationSchema = new Schema({
    ref_id: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        require: true
    },
    res_id: {
        type: Number,
        require: true
    },
    res_name: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    nop: {
        type: Number,
        require: true
    },
    contact: {
        type: Number,
        require: true
    },
    occasion: {
        type: String,
        require: true
    },
    sbdat: {
        type: Date,
        default: Date().toLocaleString(),
        require: true
    },
    sdate: {
        type: Date,
        require: true
    },
    ssdat: {
        type: Date,
        require: true
    },
    sedat: {
        type: Date,
        require: true
    },
    slot: {
        type: String,
        require: true
    },
    table_no: {
        type: Number,
        require: true
    },
    cart:[
        {
            iname: String,
            iprice: Number,
            iphoto: String,
            iqty: Number,
            status: Number
        }
    ],
    order:[
        {
            iname: String,
            iprice: Number,
            iphoto: String,
            iqty: Number,
            status: Number
        }
    ],
    status: {
        type: Boolean,
        default: false,
        require: true
    },
    ordered:{
        type: Boolean,
        default: false,
        require: true
    }
});

const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;