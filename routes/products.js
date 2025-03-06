var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');

// Hàm buildQuery để lọc sản phẩm (chỉ lấy sản phẩm chưa bị xoá mềm)
function buildQuery(obj) {
  let result = { deletedAt: null }; // Chỉ lấy sản phẩm chưa bị xoá

  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }
  
  if (obj.price && typeof obj.price === 'object') {
    result.price = {};
    if (obj.price.$gte) {
      result.price.$gte = Number(obj.price.$gte);
    } else {
      result.price.$gte = 0;
    }
    if (obj.price.$lte) {
      result.price.$lte = Number(obj.price.$lte);
    } else {
      result.price.$lte = 10000;
    }
  }

  return result;
}

/* GET danh sách sản phẩm (bỏ qua sản phẩm đã xoá mềm) */
router.get('/', async function(req, res) {
  try {
    let products = await productModel.find(buildQuery(req.query));
    res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* GET sản phẩm theo ID */
router.get('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let product = await productModel.findOne({ _id: id, deletedAt: null });
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* POST tạo sản phẩm mới */
router.post('/', async function(req, res) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      description: req.body.description,
      imgURL: req.body.imgURL
    });

    await newProduct.save();
    res.status(201).send({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* PUT cập nhật sản phẩm theo ID */
router.put('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let updateData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      description: req.body.description,
      imgURL: req.body.imgURL
    };

    // Xóa các trường không được cập nhật
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    let product = await productModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* DELETE xoá mềm sản phẩm theo ID */
router.delete('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let product = await productModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.status(200).send({
      success: true,
      message: "Đã xoá sản phẩm (xóa mềm)",
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* PATCH khôi phục sản phẩm đã bị xoá mềm */
router.patch('/restore/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let product = await productModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm hoặc sản phẩm chưa bị xoá"
      });
    }

    res.status(200).send({
      success: true,
      message: "Khôi phục sản phẩm thành công",
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
