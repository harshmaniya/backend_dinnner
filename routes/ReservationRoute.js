const express = require('express');
const User = require('../models/User')
const ResInfo = require('../models/ResInfo')
const Reservation = require('../models/Reservation')
const router = express.Router()

// for table-booking
router.post('/reservation', async (req, res) => {

    const {user_id, res_id, res_name, name, nop, contact, occasion, slot, date, table_no} = req.body;
    const sdate = date;

    console.log(user_id, res_id, res_name, name, nop, contact, occasion, slot, date, table_no);

    // Check if all required fields are present in the request body
    if (!user_id || !res_id || !res_name || !name || !nop || !contact || !occasion) {
        console.log("Some fields are missing!");
        return res.status(422).json({error: "Some fields are missing"});
    }

    // for generateSDAT
    // 9-10, 10-11, 11-12, 12-1, 1-2, 2-3, 7-8, 8-9, 9-10, 10-11
    function generateSDAT(slot, date) {
        // slot start time
        const sst = ["09:00:00.000+00:00", "10:00:00.000+00:00", "11:00:00.000+00:00", "12:00:00.000+00:00", "13:00:00.000+00:00", "14:00:00.000+00:00", "19:00:00.000+00:00", "20:00:00.000+00:00", "21:00:00.000+00:00", "22:00:00.000+00:00"];
        // slot end time
        const sat = ["10:00:00.000+00:00", "11:00:00.000+00:00", "12:00:00.000+00:00", "13:00:00.000+00:00", "14:00:00.000+00:00", "15:00:00.000+00:00", "20:00:00.000+00:00", "21:00:00.000+00:00", "22:00:00.000+00:00", "23:00:00.000+00:00"];
        const slotstart = `${date}T${sst[slot]}`;
        const slotend = `${date}T${sat[slot]}`;
        const z = [slotstart, slotend]
        return z;
    }

    const z1 = generateSDAT(slot, date);
    const ssdat = z1[0];
    const sedat = z1[1];
    console.log(ssdat);
    console.log(sedat);

    // for generateReservationId (ref_id)
    function generateReservationId() {
        const timestamp = new Date().getTime().toString(); // Get the current timestamp as a string
        const uniqueId = Math.random().toString(36).substring(2, 8); // Generate a unique identifier with length 10

        // Combine the timestamp and unique identifier to create the reference ID
        const reservationId = `${uniqueId}${timestamp}`;
        return reservationId.substring(0, 12);
    }

    // give uniqueid
    let ref_id = generateReservationId();
    console.log(ref_id);
    const refExists = await Reservation.findOne({ref_id});
    if (refExists) {
        ref_id = generateReservationId();
        console.log(ref_id); // Output: "fkz100167957"
    }

    try {
        // Create the reservation
        const reservation = new Reservation({
            ref_id, user_id, res_id, res_name, name, nop, contact, occasion, sdate, ssdat, sedat, slot, table_no
        });

        // Save the reservation to the database
        const savedReservation = await reservation.save();

        // Check if a user with the given ID exists
        const userExists = await User.findOne({_id: user_id});
        userExists.addRefId(ref_id);
        if (!userExists) {
            console.log("User not found");
            return res.status(404).json({error: "User not found"});
        }

        // Check if a user with the given ID exists
        const resExists = await ResInfo.findOne({res_id});
        resExists.addRefId(ref_id);
        if (!resExists) {
            console.log("Restaurant not found");
            return res.status(404).json({error: "Restaurant not found"});
        }

        // Return the saved reservation as the response
        return res.json(savedReservation);

    } catch
        (e) {
        console.log(e);
        return res.status(500).json({error: "Server error"});
    }
});



// getreservedslotes
router.get('/getreservedslotes/:res_id/:date', async (req, res) => {
    let sdate = req.params.date;
    const res_id = req.params.res_id;
    console.log(sdate);

    const tableslot = {
        0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    let slotes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    try {
        const data = await Reservation.find({sdate, res_id});
        let datalen = data.length

        if(datalen > 100){
            res.status(500).send("Error in your getreservedslotes code;");
        }

        for (let i = 0; i < datalen; i++) {
            console.log(data[i].slot);
            tableslot[data[i].slot][data[i].table_no] = 1;
        }

        for (let i = 0; i < 10; i++) {
            let count = 0;
            for (let j = 0; i < 10; i++) {
                if (tableslot[i][j] == 1) {
                    count++;
                }
            }
            slotes[i] = 0;
            if (count == 10) {
                slotes[i] = 1;
            }
        }

        console.log(tableslot);
        console.log(slotes);

        res.send(slotes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//  getreservedtables
router.get('/getreservedtables/:date/:slot/:res_id', async (req, res) => {
    let sdate = req.params.date;
    let slotn = req.params.slot;
    const res_id = req.params.res_id;
    const tables = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    try {
        const data = await Reservation.find({ res_id, sdate, slot:slotn });
        let datalen = data.length

        if(datalen > 10){
            res.status(500).send("Error in your getreservedtables code;");
        }
        for (let i = 0; i < datalen; i++) {
            tables[data[i].table_no] = 1;
        }

        res.send(tables);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// for booking-card data show
router.get('/data:id', async (req, res) => {
    let user_id = req.params.id;
    // user_id = user_id.substring(1, 25);
    try {
        const data = await Reservation.find({user_id});
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;