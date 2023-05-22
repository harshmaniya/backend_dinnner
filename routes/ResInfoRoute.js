// this route file write for Super Admin
const ResInfo = require('../models/ResInfo')
const express = require('express');
const router = express.Router()
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// for Super Admin login
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const SuperAExist = await ResInfo.findOne({username});
        if (SuperAExist) {
            bcrypt.compare(password, SuperAExist.password, async (err, result) => {
                if (result) {
                    if (username == SuperAExist.username && password == SuperAExist.password) {
                        res.status(200).json({message: "SuperAdmin Login successful"});
                    } else {
                        res.status(401).json({message: "Wrong Username & Password"});
                    }
                }
            });
        }
    } catch
        (err) {
        console.log(err);
    }
});

//SuperAdmin Reastaurant Registration
router.post('/resregistration', async (req, res, next) => {
    // fetch data from frontend
    const {
        res_name,
        address,
        res_contact_number,
        email,
        nostaff,
        notable,
        owner_name,
        owner_contact_no
    } = req.body;

    function generatePassword() {
        var length = 10,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    console.log(
        res_name,
        address,
        res_contact_number,
        email,
        nostaff,
        notable,
        owner_name,
        owner_contact_no);

    // for check any property empty or not
    if (!res_name || !address || !res_contact_number || !email || !nostaff || !notable || !owner_name || !owner_contact_no || res_contact_number.toString().length != 10 || owner_contact_no.toString().length != 10) {
        console.log("plz filled the field properly");
        return res.status(422).json({error: "incorrect input"});
    }

    let password = generatePassword();
    const res_id = Math.floor((Math.random() * 1000000) + 1);

    bcrypt.hash(password, 10, async (err, hash) => {
        const temp_pass = password;
        password = hash;

        //put data to database
        try {
            const resInfoExist = await ResInfo.findOne({email});
            if (resInfoExist) {
                console.log("Username & Restaurant already exist");
                return res.status(409).json({error: "Username & Restaurant already exist"});
            }
            const resInfoExist1 = await ResInfo.findOne({ res_contact_number});
            if (resInfoExist1) {
                console.log("User email already exist");
                return res.status(409).json({error: "User email already exist"});
            }

            const newResInfo = new ResInfo({
                res_id,
                password,
                res_name,
                address,
                res_contact_number,
                email,
                nostaff,
                notable,
                owner_name,
                owner_contact_no
            });
            console.log("try start");
            await newResInfo.save();

            const ref = {
                "password":temp_pass
            }
            res.status(201).json(ref);
            console.log("user registered successfully")
        } catch (err) {
            console.log("Something error between storing data!");
            console.log(err);
            return res.status(500).json({error: "server error"});
        }
    });
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

//get data by id
router.get('/data:id', async (req, res) => {
    const res_id = req.params.id;
    console.log(res_id);
    try {
        const data = await ResInfo.findOne({res_id});
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// delete restaurant
router.get('/delete:id', async (req, res) => {
    const res_id = req.params.id;
    console.log(res_id);
    try {
        const data = await ResInfo.deleteOne({res_id});
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// update restaurant
router.put('/update:id', async (req, res) => {
    const res_id = req.params.id;
    const {
        res_name,
        address,
        res_contact_number,
        email,
        nostaff,
        notable,
        owner_name,
        owner_contact_no
    } = req.body;
    console.log(res_id);
    try {
        const update = await ResInfo.findOneAndUpdate({res_id}, {
            $set: {
                res_name,
                address,
                res_contact_number,
                email,
                nostaff,
                notable,
                owner_name,
                owner_contact_no
            }
        }, {new: true});

            if (!update) {
                console.log("error in update")
                res.status(501).send('Server Error');
            } else {
                console.log("Updated");
                res.status(200).send("Updated");
            }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
});


module.exports = router;