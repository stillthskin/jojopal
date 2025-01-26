const express = require('express');
const Product = require('../models/products');
const multer = require('multer');
const path = require('path');

const router = express.Router();



const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Specify the folder to save files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));  // Set a unique filename
    }
  });


  const upload = multer({ storage: storage });

  // POST route for adding a product
 router.post('/productpost', upload.array('productimage', 5), async (req, res) => {
      console.log('At endpoint');
      
      const { name, price, category } = req.body;
      const imageUrl = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : ''; // Main image
      const additionalImages = req.files ? req.files.slice(1).map(file => `/uploads/${file.filename}`) : []; // Additional images (skip first)
  
      const newProduct = new Product({
        name,
        price,
        category,
        imageUrl,
        additionalImages
      });

    try {
        await newProduct.save();
        res.status(200).json({ message: 'Product uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading product', error });
    }
});

// Backend: Adjust the response format
router.get('/allproducts', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;

    // Convert to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;

    // Build the search and category filters
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const categoryQuery = category ? { category: { $regex: category, $options: 'i' } } : {};

    // Combine search and category filters
    const filterQuery = { ...searchQuery, ...categoryQuery };

    // Fetch products
    const products = await Product.find(filterQuery)
      .skip(skip)
      .limit(limitNumber);

    // Get the total count for pagination
    const totalCount = await Product.countDocuments(filterQuery);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Send the data in the response
    res.status(200).json({
      currentPage: pageNumber,
      totalPages: totalPages,
      totalCount: totalCount,
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


module.exports = router;