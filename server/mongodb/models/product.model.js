import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: [{ type: String, required: true }],
    attributes: [{ type: String }],
    colors: [{ 
        name: {type: String, required: true},
        url: {type: String, required: true}
    }],
    imageUrls: [{ type: String, required: true }],
});

const Product = mongoose.model('Product', productSchema);

export default Product;