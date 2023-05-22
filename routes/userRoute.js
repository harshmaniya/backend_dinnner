const express = require('express');
// const { redirect, HashRouter } = require('react-router-dom');
const User = require('../models/User')
const ResInfo = require('../models/ResInfo')
const router = express.Router()
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const userExist = await User.findOne({email});
        if (userExist) {
            bcrypt.compare(password, userExist.password, async (err, result) => {
                if (result) {
                    console.log(userExist)
                    res.status(200).json({userExist});
                    console.log("User login Successfuly");
                } else {
                    res.status(401).json({message: "Wrong Password"});
                }
            })
        } else {
            res.status(405).json({message: "User not Exist"});
        }
    } catch (err) {
        console.log(err);
    }
});


//user register
router.post('/register', async (req, res, next) => {

    // fetch data from frontend
    const {fname, lname, email, mobile, password, cpassword, pcode, city, state} = req.body;

    // for check any property empty or not
    if (!fname || !lname || !mobile || !email || !password || !cpassword || !pcode || !city || !state || mobile.toString().length != 10) {
        console.log("plz filled the field properly");
        return res.status(422).json({error: "incorrect input"});
    }

    let hashpass, hashcpass;
    bcrypt.hash(password, 10, async (err, hash) => {
        hashpass = hash

    });
    bcrypt.hash(cpassword, 10, async (err, hash) => {
        hashcpass = hash

    });

    //put data to database
    try {
        const userExist = await User.findOne({email, mobile});
        if (userExist) {
            console.log("User email already exist");
            return res.status(409).json({error: "User email already exist"});
        }
        const userExist1 = await User.findOne({mobile});
        if (userExist1) {
            console.log("User mobile already exist");
            return res.status(409).json({error: "User mobile already exist"});
        }
        const user = new User({
            fname,
            lname,
            email,
            password: hashpass,
            cpassword: hashcpass,
            mobile,
            pcode,
            city,
            state
        });
        await user.save();
        res.status(201).json({message: "user registered successfuly"});
        console.log("user registered successfuly")
    } catch {
        console.log("Something error between storing data!");
    }

});


// for data fatching from database
router.get('/data', async (req, res) => {
    try {
        const data = await ResInfo.find();
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;


// res.status(201).json({ message: "UserExist" });

// User.generateAuthToken = async function () {
//     try {
//         let token = jwt.sign(
//             { _id: this._id },process.env.JWT_KEY
//         );
//         this.tokens = this.tokens.concat({token:token});
//         await this.save();
//         return token;
//     }
//     catch(err){
//         console.log(err);
//     }
// }
// const token = "this is jwt token";

// jwt token cookie creation
// const token = await userExist.generateAuthToken();
// console.log(token);

// res.cookie("jwtoken", token, {
//     expires: new Date(Data.now() + 25892000000),
//     httpOnly: true
// })