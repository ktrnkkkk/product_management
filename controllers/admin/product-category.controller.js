const systemConfig = require("../../config/system")
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree")
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find={
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index",{
        pageTitle: "Danh muc san pham",
        records: newRecords
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create",{
        pageTitle: "Tao danh muc san pham",
        records: newRecords
    });
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position==""){
        const count = await ProductCategory.countDocuments();
        req.body.position =  count+1;
    }else{
        req.body.position =  parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body); //tao phia model
    await record.save(); //luu vao database

    redirect(`${systemConfig.prefixAdmin}/products-category`)
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });
    
        const records = await ProductCategory.find({
            deleted: false
        });
    
        const newRecords = createTreeHelper.tree(records);
    
        res.render("admin/pages/products-category/edit",{
            pageTitle: "Chinh sua danh muc san pham",
            data: data,
            records: newRecords
        });
    }catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
    
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position =  parseInt(req.body.position);

    await ProductCategory.updateOne({id: id,},req.body);
    res.redirect("back");
}