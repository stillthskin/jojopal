require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoute');
//const orderRoutes = require('./routes/orderRoutes');
const path = require('path')


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);  // Added route prefix for better structure
app.use('/api/carts', cartRoutes); 
//app.use(orderRoutes);

app.use(express.static(path.join(__dirname,'static')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'static', '404.html'));  // Make sure the path to 404.html is correct
// });


app.get('/test',(req, res) => {
    console.log('Test end point hit!');
    res.status(404).sendFile(path.join(__dirname, 'static', '404.html'));  // Make sure the path to 404.html is correct
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });


  app.use('/api/auth', authRoutes);
// app.get('/test',(req,res)=>{
//     res.status(200).send({ success: 'True' });
    
    
//     });



// Connect to MongoDB
const PORT = process.env.PORT || 5000;
 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => {
         console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.log('MongoDB connection error: ', err));
