const mongoose=require("mongoose");
const slug= require("mongoose-slug-updater");
const productCategorySchema =new mongoose.Schema(
    {
        title: String,
        parent_id:{
            type: String,
            default: ""
        },
        description:String,
        thumbnail: String,
        status: String,
        position: Number,
        slug:{
            type: String,
            slug: "title",
            unique: true
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },{
        timestamps: true // tu dong tao 2 thuoc tinh: createdAt,updateAt
    }
);

const ProductCategory = mongoose.model('ProductCategory',productCategorySchema,'products-category');
module.exports=ProductCategory;