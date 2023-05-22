const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express()
const port = 9000

app.use(cors());
app.use(express.json())

app.get('/', (req, res) =>
    res.send("Hello Students ..")
)

// Here, Available Routes
app.use('/api/userRoute', require('./routes/userRoute'));
app.use('/api/superadminRoute', require('./routes/ResInfoRoute'));
app.use('/api/reservation', require('./routes/ReservationRoute'));
app.use('/api/admin', require('./routes/AdminRoute'));
app.use('/api/chef', require('./routes/ChefRoute'));
app.use('/api/order', require('./routes/OrderRoute'));
app.use('/api/test', require('./routes/TestRoute'));

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
})

connectToMongo();