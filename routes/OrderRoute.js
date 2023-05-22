const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ResInfo = require('../models/ResInfo');
const Reservation = require('../models/Reservation');


router.put('/updatebooking', async (req, res) => {
    const {ref_id} = req.body;
    console.log(ref_id);
    try {
        const result = await Reservation.findOneAndUpdate({ ref_id }, { $set: { status: true } }, { new: true });
        if(!result) {
            res.status(500).send('error');
        }else{
            res.status(200).json(result);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
});

//temp cart item add
router.put('/addtocart:id', async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    const { iname, iprice, iphoto, iqty } = req.body;
    const status = 0;
    const newCartItem = {
        iname, iprice, iphoto, iqty, status
    };
    console.log(newCartItem);

    const addItem = Reservation.findOneAndUpdate(
        { ref_id: id },
        { $push: { cart: newCartItem } },
        { new: true },
        (err, doc) => {
            if (err) {
                console.log("Error:", err);
                res.status(500).send('Server Error');
            } else {
                console.log(doc)
                // let invlen = doc.cart.length - 1;
                // console.log("Updated document:", doc.cart[invlen]);
                console.log("Updated")
                res.status(200).send("Updated");
            }
        }
    );
});

router.get('/getcartdata:id', async (req, res, next) => {
    const id = req.params.id;
        try {
            const data = await Reservation.findOne({ ref_id: id});
            res.json(data);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

router.put('/updatetocart/:id/:_id', async (req, res) => {
    const ref_id = req.params.id;
    const _id = req.params._id;
    const { iqty } = req.body;
    if(iqty < 0 & iqty == 1){
        return  res.status(501).send('Failed to update item');;
    }
    console.log(ref_id, _id);
    try {
        const updatecart = await ResInfo.findOneAndUpdate({ ref_id , cart: { $elemMatch: { _id } } },
            { $set: {"inventory.$.iqty": iqty
                } }
        );
        console.log("updateitem: ",updatecart);
        if(!updatecart){
            console.log("in item update have some error");
            res.status(502).send('Failed to update item');
        }
        else{
            console.log("item updated");
            res.status(200).send('item updated successfully');
        }
    } catch (err) {
        console.error(err.message);
        res.status(503).send('Server Error');
    }
});

router.put('/deletecartitem:id', async (req, res) => {
    const ref_id = req.params.id;
    const { _id } = req.body;
    console.log(_id, ref_id);
    try {
        const data = await Reservation.updateOne(
            { ref_id },
            { $pull: { cart: { _id }}});
        if(data){
            console.log(data);
            res.status(200).send('deleted');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/ordernow', async (req,res) => {
    const {ref_id} = req.body;
    console.log(ref_id);
    try{
        // Find the reservation with the given ref_id and non-empty cart
        const reservation = await Reservation.findOne({ ref_id });

        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found or cart is empty' });
        }
        console.log(reservation);

        // Move all documents from cart to order
        reservation.order = reservation.order.concat(reservation.cart);
        reservation.cart = [];

        // Save the updated reservation
        await reservation.save();

        // Send a response to the client indicating success
        res.status(200).send('Documents moved from cart to order');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/checkout', async (req, res) => {
    const {ref_id} = req.body;
    console.log(ref_id);
    try {
        const result = await Reservation.findOneAndUpdate({ ref_id }, { $set: { status: false } }, { new: true });
        if(!result) {
            res.status(500).send('error');
        }else{
            res.status(200).send('updated');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
});


module.exports = router;