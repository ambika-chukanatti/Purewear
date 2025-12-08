import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrls: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    colors: [{ 
        name: {type: String, required: true},
        url: {type: String, required: true}
    }],
    attributes: [{ type: String }],
});

const Product = mongoose.model('Product', productSchema);

export default Product;