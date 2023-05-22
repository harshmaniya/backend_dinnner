const express = require('express');
const User = require('../models/User')
const ResInfo = require('../models/ResInfo')
const Reservation = require('../models/Reservation')
const router = express.Router()
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());


//login
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


router.post('/upload:id', async (req, res) => {
    // Handle the uploaded file
    const {photo} = req.body;
    if (photo != "") {
        console.log(photo);
    } else {
        console.log("not photo");
    }
    const res_id = req.params.id;
    const filter = {res_id: res_id};
    const update = {photo: photo};
    const options = {new: true, upsert: true};
    const uploadPhoto = await ResInfo.findOneAndUpdate(filter, update, options);
    if (uploadPhoto) {
        res.status(200);
    } else {
        res.status(500);
    }
});

router.get('/data:id', async (req, res) => {
    const res_id = req.params.id;
    console.log(res_id);
    try {
        const data = await ResInfo.findOne({res_id});
        // console.log(data);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/additem:id', async (req, res) => {

    const res_id = req.params.id;
    const {iname, idescription, iprice, icategory, iphoto} = req.body;
    const newInventoryItem = {
        iname, idescription, iprice, icategory, iphoto
    };
    const addItem = ResInfo.findOneAndUpdate(
        {res_id},
        {$push: {inventory: newInventoryItem}},
        {new: true},
        (err, doc) => {
            if (err) {
                console.log("Error:", err);
                // res.status(500);
            } else {
                let invlen = doc.inventory.length - 1;
                console.log("Updated document:", doc.inventory[invlen]);
                // res.status(200);
            }
        }
    );
    if (!addItem) {
        console.log("error in update")
        res.status(501).send('Server Error');
    } else {
        console.log("Updated");
        res.status(200).send("Updated");
    }

});

// delete inventory item
router.put('/delete:id', async (req, res) => {
    const id = req.params.id;
    const {res_id} = req.body;
    console.log(id);
    try {
        const data = await ResInfo.updateOne(
            {res_id},
            {$pull: {inventory: {_id: id}}});
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/getinventory/:id/:_id', async (req, res) => {
    const res_id = req.params.id;
    const _id = req.params._id;
    console.log(res_id, _id)
    try {
        const doc = await ResInfo.findOne({res_id, inventory: {$elemMatch: {_id}}}, {"inventory.$": 1});

        if (!doc) {
            return res.status(404).json({msg: 'Document not found'});
        }
        console.log(doc)
        res.json(doc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/updateinventory/:id/:_id', async (req, res) => {
    const res_id = req.params.id;
    const _id = req.params._id;
    const {iname, idescription, iprice, icategory, iphoto} = req.body;
    if (!iname && !idescription && !iprice && !icategory && !iphoto) {
        return res.status(501);
    }
    console.log(res_id, _id);
    try {
        const updateitem = await ResInfo.findOneAndUpdate({res_id, inventory: {$elemMatch: {_id}}},
            {
                $set: {
                    "inventory.$.iname": iname,
                    "inventory.$.idescription": idescription,
                    "inventory.$.iprice": iprice,
                    "inventory.$.icategory": icategory,
                    "inventory.$.iphoto": iphoto
                }
            }
        );
        console.log("updateitem: ", updateitem);
        if (!updateitem) {
            console.log("in item update have some error");
            res.status(502).send('Failed to update inventory item');
        } else {
            console.log("item updated");
            res.status(200).send('Inventory item updated successfully');
        }
    } catch (err) {
        console.error(err.message);
        res.status(503).send('Server Error');
    }
});


module.exports = router;