import Product from "../../mongodb/models/product.model.js";

const getAllProducts = async(req,res) => {
    try{
        const products = await Product.find({});

        if(!products){
            return res.status(404).json({ success: false, message: "Products not found"});
        }

        return res.status(200).json({ success: true, data: products });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
        console.log(err)
    }
};

const getProduct = async(req,res) => {
    const pid = req.params.pid;

    try{
        const product = await Product.findById(pid);

        if(!product){
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        return res.status(200).json({ success: true, data: product });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const postProduct = async(req,res) => {
    const { name, description, price, imageUrls, colors, sizes, stockQty, attributes } = req.body;
    try{
        const product = await Product.create({ name, description, price, imageUrls, colors, sizes, stockQty, attributes });

        if(!product){
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        return res.status(200).json({ success: true, data: product });
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateProduct = async(req,res) => {
    const pid = req.params.pid;
    const { name, description, price, imageUrl, colors, sizes, stockQty, attributes } = req.body;

    try{
        const update = { 
            name: name, 
            description: description, 
            price: price,
            imageUrl: imageUrl, 
            colors: colors, 
            sizes: sizes, 
            stockQty: stockQty, 
            attributes: attributes 
        }

        const product = await Product.findOneAndUpdate({_id: pid}, update, {new: true});

        if(!product){
            return res.status(404).json({ success: false, message: "Product update failed"});
        }

        return res.status(200).json({ success: true, data: product });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteProduct = async(req,res) => {
    const pid = req.params.pid;

    try{
        const deletedProduct = await Product.findByIdAndDelete(pid);

        if(!deletedProduct){
            return res.status(404).json({ success: false, message: "Product doesn't exists"});
        }

        return res.status(200).json({ success: true, data: deletedProduct });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

export { getAllProducts, getProduct, postProduct, updateProduct, deleteProduct }