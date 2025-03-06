var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj){
  console.log(obj);
  let result = {};
  if(obj.name){
    result.name=new RegExp(obj.name,'i');
  }
  
  if (obj.price && typeof obj.price === 'object') {
    result.price = {};
    if (obj.price.$gte) {
      result.price.$gte = Number(obj.price.$gte); // Ép kiểu sang số
    } else {
      result.price.$gte = 0;
    }
    if (obj.price.$lte) {
      result.price.$lte = Number(obj.price.$lte); // Ép kiểu sang số
    } else {
      result.price.$lte = 10000;
    }
  }
  return result;
}

/* GET users listing. */
router.get('/', async function(req, res) {
  let products = await productModel.find(buildQuery(req.query));
  res.status(200).send({
    success:true,
    data:products
  });
});

router.get('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

router.post('/', async function(req, res) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price:req.body.price,
      quantity: req.body.quantity,
      category:req.body.category
    })
    await newProduct.save();
    res.status(200).send({
      success:true,
      data:newProduct
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

// New PUT route for updating products
router.put('/:id', async function(req, res, next) {
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
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    let product = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "khong tim thay san pham"
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

// New DELETE route (soft delete)
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "khong tim thay san pham"
      });
    }
    
    res.status(200).send({
      success: true,
      message: "xoa san pham thanh cong",
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
