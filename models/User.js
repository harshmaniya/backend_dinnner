const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    mobile: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cpassword: {
        type: String,
        require: true
    },
    pcode: {
        type: Number,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    reservation: [
        {
            ref_id: String
        }
    ]
})

UserSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({_id: this._id}, process.env.JWT_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

UserSchema.methods.addRefId = async function (ref) {
    try {
        this.reservation = this.reservation.concat({ref_id: ref});
        await this.save();
    } catch (err) {
        console.log(err);
    }
}


const User = mongoose.model('User', UserSchema);
module.exports = User;