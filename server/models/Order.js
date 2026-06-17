import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Success', 'Pending', 'Failed']
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Food', 'Books', 'Other']
    },
}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);
