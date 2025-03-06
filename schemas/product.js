let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    imgURL: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true
    },
    deletedAt: {  // Trường hỗ trợ xóa mềm
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Middleware tự động ẩn sản phẩm đã bị xóa mềm
productSchema.pre(/^find/, function(next) {
    this.where({ deletedAt: null });
    next();
});

// Phương thức tĩnh: Cập nhật sản phẩm theo ID
productSchema.statics.updateProduct = async function(id, updateData) {
    return await this.findOneAndUpdate(
        { _id: id, deletedAt: null },
        updateData,
        { new: true, runValidators: true }
    );
};

// Phương thức tĩnh: Xóa mềm sản phẩm theo ID
productSchema.statics.softDeleteProduct = async function(id) {
    return await this.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
    );
};

// Phương thức tĩnh: Khôi phục sản phẩm đã xóa mềm
productSchema.statics.restoreProduct = async function(id) {
    return await this.findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } },
        { deletedAt: null },
        { new: true }
    );
};

module.exports = mongoose.model('Product', productSchema);
