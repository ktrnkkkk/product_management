const mongoose=require("mongoose");
const roleSchema =new mongoose.Schema(
    {
        title: String,
        description:String,
        permission: {
            type: Array,
            default:[]
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true // tu dong tao 2 thuoc tinh: createdAt,updateAt
    }
);

const Role = mongoose.model('Role',roleSchema,'roles');
module.exports=Role;