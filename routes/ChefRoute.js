const express = require('express');
const User = require('../models/User')
const ResInfo = require('../models/ResInfo')
const router = express.Router()
const bcrypt = require('bcryptjs');
const Reservation = require("../models/Reservation");

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const adminExist = await ResInfo.findOne({ email });
        if (adminExist) {
            bcrypt.compare(password, adminExist.password, async (err, result) => {
                if (result) {
                    console.log("Admin login Successfuly");
                    res.status(200).json(adminExist);
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

router.get('/gettabledata:id', async (req, res, next) => {
    const ref_id = req.params.id;
    console.log(ref_id);
    try {
        const data = await Reservation.findOne({ref_id});
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/gettablestatus:id', async (req, res, next) => {
    const res_id = req.params.id;
    console.log(res_id);
    const currentDate = new Date().toISOString().slice(0, 10);
    console.log(currentDate + "T00:00:00.000+00:00");
    try {
        const data = await Reservation.find({res_id, sdate: currentDate + "T00:00:00.000+00:00", status: true});
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



router.put('/acceptorder/:id', async (req, res) => {
    const ref_id = req.params.id;
    const _id = req.body;
    try {
        const updateitem = await Reservation.findOneAndUpdate({ ref_id , order: { $elemMatch: { _id } } },
            { $set: {"order.$.status": 1,
                } }
        );
        if(!updateitem){
            console.log("in item update have some error");
            res.status(502).send('Failed to update inventory item');
        }
        else{
            console.log("updated");
            res.status(200).send('Inventory item updated successfully');
        }
    } catch (err) {
        console.error(err.message);
        res.status(503).send('Server Error');
    }
});

router.put('/deliveryorder/:id', async (req, res) => {
    const ref_id = req.params.id;
    const _id = req.body;
    try {
        const updateitem = await Reservation.findOneAndUpdate({ ref_id , order: { $elemMatch: { _id } } },
            { $set: {"order.$.status": 2,
                } }
        );
        if(!updateitem){
            console.log("in item update have some error");
            res.status(502).send('Failed to update inventory item');
        }
        else{
            console.log("updated");
            res.status(200).send('Inventory item updated successfully');
        }
    } catch (err) {
        console.error(err.message);
        res.status(503).send('Server Error');
    }
});

module.exports = router;