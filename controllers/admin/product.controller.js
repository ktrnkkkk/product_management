const Product = require("../../models/product.model");
const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination");
const { prefixAdmin } = require("../../config/system");


//[GET] /admin/products
module.exports.index = async (req, res) => {
    
    const filterStatus = filterStatusHelper(req.query);

    let find={
        deleted: false
    };
    // co status ma ng dung truyen vao url
    if(req.query.status){
        find.status =  req.query.status;
    }

    const  objectSearch = searchHelper(req.query);

    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    //pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countProducts
    );

    // end pagination
    const products = await Product.find(find)
        .sort({position:"desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index",{
        pageTitle: "Trang san pham",
        products: products,
        filterStatus: filterStatus,
        keyword:objectSearch. keyword,
        pagination: objectPagination
    });
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id},{status: status});

    req.flash("success","Cap nhat trang thai san pham thanh cong");

    res.redirect("back");
}
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: ids}},{status: "active"});
            req.flash("success",`Cap nhat trang thai thanh cong ${ids.length} san pham`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}},{status: "inactive"});
            req.flash("success",`Cap nhat trang thai thanh cong ${ids.length} san pham`);
            break;
        case "delete-all":
            await Product.updateMany(
                {_id: {$in: ids}},
                {
                deleted: "true",
                deletedAt: new Date(),
            });
            req.flash("success",`Da xoa thanh cong ${ids.length} san pham`);
            break;
        case "change-position":
            for (const item of ids){
                let[id,position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id},{position: position});
            }
            req.flash("success",`Cap nhat trang thai thanh cong ${ids.length} san pham`);
            break;
            
        default:
            break;
    } 
    res.redirect("back");
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({_id: id},{
        deleted : true,
        deletedAt: new Date()
    });
    req.flash("success",`Da xoa thanh cong san pham`);
    res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create",{
       pageTitle:"Them moi san pham"
    });
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position==""){
        const countProducts = await Product.countDocuments();
        req.body.position =  countProducts+1;
    }else{
        req.body.position =  parseInt(req.body.position);
    }
    if(req.file){
        req.body.thumbnail=`/uploads/${req.file.filename}`
    }
    const product = new Product(req.body); //tao phia model
    await product.save(); //luu vao database
    
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] /admin/products/edit
module.exports.edit = async (req, res) => {
    try{
        const find={
            deleted:false,
            _id: req.params.id
    
        };
        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit",{
           pageTitle:"Chinh sua san pham ",
           product: product
        });
    }catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}
//[PATCH] /admin/products/edit
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position =  parseInt(req.body.position);
    if(req.file){
        req.body.thumbnail=`/uploads/${req.file.filename}`
    }
    try{
        await Product.updateOne({_id: id },req.body);
        req.flash("success",`cap nhat thanh cong san pham`);
    }catch(error){
        req.flash("serror",`cap nhat thanh congthat bai`);
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const find={
            deleted:false,
            _id: req.params.id
    
        };
        const product = await Product.findOne(find);
        res.render("admin/pages/products/detail",{
           pageTitle: product.title,
           product: product
        });
    }catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}