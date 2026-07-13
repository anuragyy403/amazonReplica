const Product = require('../models/product');

//GET PRODUCT

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200)
            .json(products);
    } catch (error) {
        res.status(500)
            .json({ message: error.message });
    }
}

//GET SPECIFIC PRODUCT

const getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//POST CREATE PRODUCT

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, brand, stock, user } = req.body;
        const product = new Product({
            name,
            description,
            price,
            image,
            category,
            brand,
            stock,
            user: req.user._id
        });
        res.status(201)
            .json(await product.save());
    } catch (error) {
        res.status(500)
            .json({ message: error.message });
    }
}

// Route update Product

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        Object.assign(product, req.body);
        const updated = await product.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Delete Product

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct
}