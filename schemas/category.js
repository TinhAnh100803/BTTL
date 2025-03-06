let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Thêm phương thức CRUD vào schema

// Lấy danh sách tất cả danh mục
categorySchema.statics.getAllCategories = async function () {
    return await this.find();
};

// Lấy một danh mục theo ID
categorySchema.statics.getCategoryById = async function (id) {
    return await this.findById(id);
};

// Tạo danh mục mới
categorySchema.statics.createCategory = async function (categoryData) {
    return await this.create(categoryData);
};

// Cập nhật danh mục theo ID
categorySchema.statics.updateCategory = async function (id, updateData) {
    return await this.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa danh mục theo ID
categorySchema.statics.deleteCategory = async function (id) {
    return await this.findByIdAndDelete(id);
};

module.exports = mongoose.model('category', categorySchema);
