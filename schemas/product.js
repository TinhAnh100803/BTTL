let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },description:{
        type:String,
        default:""
    },quantity:{
        type:Number,
        default:0,
        min:0
    },imgURL:{
        type:String,
        default:""
    },category:{
        type:String,
        required:true
    },deletedAt: {  // Added for soft delete
        type: Date,
        default: null
    }
},{
    timestamps:true
})

// Optional: Add a query middleware to filter out soft-deleted products
productSchema.pre('find', function() {
    this.where({ deletedAt: null });
});
productSchema.pre('findOne', function() {
    this.where({ deletedAt: null });
});

module.exports = mongoose.model('product',productSchema)