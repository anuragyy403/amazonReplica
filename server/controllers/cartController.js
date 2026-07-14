const Product = require('../models/product');
const Cart = require('../models/cart');


//Get the cart  @route GET /api/cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({user: req.user._id, items: []});
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Add to cart Route  POST /api/cart

const addToCart = async (req, res) => {
    try{
        const { productId, quantity} = req.body;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404)
            .json({message: "Product not found"});
        }
        let cart = await Cart.findOne({ user: req.user._id});
        if(!cart){
            cart = await Cart.create({user: req.user._id, items: []});
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if(existingItem){
            existingItem.quantity += quantity;
        }else {
            cart.items.push({ product: productId, quantity: quantity || 1});
        }
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.status(200)
        .json(populatedCart);
    } catch(error){
        res.status(500)
        .json({message:error.message});
    }
};

//Update to cart Route PUT /api/cart/:productId

const updateCartItem = async(req,res) => {
    try{
        const {quantity} = req.body;
        const cart = await Cart.findOne({user: req.user._id});
        if(!cart){
            return res.status(404)
            .json({message: "Cart not found"})
        }
        const item = cart.items.find(item => item.product.toString() === req.params.productId);
        if(!item){
            return res.status(404)
            .json({message: "Item not found"});
        }

        item.quantity = quantity;
        await cart.save();

        const populatedCart = await cart.populate('items.product');
        res.status(200)
        .json(populatedCart);
    }catch(err){
        res.status(404)
        .json({message:err.message})
    }
};

// @route DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Delete the cart /api/cart

const clearCart = async(req,res) => {
    try{
        const cart = await Cart.findOne({user:req.user._id});
        if(!cart){
            return res.status(404)
            .json({message:"Cart not Found"});
        }
        cart.items = [];
        await cart.save();
        res.status(200)
        .json(cart)
    }catch(error){
        res.status(404)
        .json({message:error.message});
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };