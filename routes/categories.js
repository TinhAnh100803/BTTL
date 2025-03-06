// routes/categories.js
var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');

// CREATE
router.post('/', async function(req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
      description: req.body.description
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// READ all
router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryModel.find();
    res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// READ one
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "khong tim thay danh muc"
      });
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// UPDATE
router.put('/:id', async function(req, res, next) {
  try {
    let updateData = {
      name: req.body.name,
      description: req.body.description
    };
    
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    let category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "khong tim thay danh muc"
      });
    }
    
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// DELETE
router.delete('/:id', async function(req, res, next) {
  try {
    let category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "khong tim thay danh muc"
      });
    }
    res.status(200).send({
      success: true,
      message: "xoa danh muc thanh cong",
      data: category
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;