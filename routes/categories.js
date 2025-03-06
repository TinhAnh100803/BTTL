var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');

// CREATE - Tạo danh mục mới
router.post('/', async function(req, res) {
    try {
        let newCategory = new categoryModel({
            name: req.body.name,
            description: req.body.description
        });
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// READ - Lấy tất cả danh mục (Không hiển thị danh mục bị xóa mềm)
router.get('/', async function(req, res) {
    try {
        let categories = await categoryModel.find({ deletedAt: null });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// READ - Lấy danh mục theo ID
router.get('/:id', async function(req, res) {
    try {
        let category = await categoryModel.findOne({ _id: req.params.id, deletedAt: null });
        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// UPDATE - Cập nhật danh mục
router.put('/:id', async function(req, res) {
    try {
        let updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.description) updateData.description = req.body.description;

        let category = await categoryModel.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE - Xóa mềm danh mục (Cập nhật deletedAt)
router.delete('/:id', async function(req, res) {
    try {
        let category = await categoryModel.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
        }

        res.status(200).json({ success: true, message: "Đã xóa danh mục (xóa mềm)", data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// RESTORE - Khôi phục danh mục đã xóa mềm
router.patch('/restore/:id', async function(req, res) {
    try {
        let category = await categoryModel.findOneAndUpdate(
            { _id: req.params.id, deletedAt: { $ne: null } },
            { deletedAt: null },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục hoặc danh mục chưa bị xóa" });
        }

        res.status(200).json({ success: true, message: "Khôi phục danh mục thành công", data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
