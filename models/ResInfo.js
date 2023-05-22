const mongoose = require('mongoose');
const {now} = require("mongoose");
// const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema

const ResInfoSchema = new Schema({
    res_id: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    res_name: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    res_contact_number: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    nostaff: {
        type: Number,
        require: true
    },
    notable: {
        type: Number,
        require: true
    },
    owner_name: {
        type: String,
        require: true
    },
    owner_contact_no: {
        type: Number,
        require: true
    },
    photo: {
            type: String
        },
    inventory:[
        {
            iname: String,
            idescription: String,
            iprice: Number,
            icategory: String,
            iphoto: String
        }
    ],
    reservation: [
        {
            ref_id: String
        }
    ]
});


ResInfoSchema.methods.addRefId = async function (ref) {
    try {
        this.reservation = this.reservation.concat({ref_id: ref});
        await this.save();
    } catch (err) {
        console.log(err);
    }
}

const ResInfo = mongoose.model('ResInfo', ResInfoSchema);
module.exports = ResInfo;