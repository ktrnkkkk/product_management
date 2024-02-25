const mongoose=require("mongoose");

module.exports.connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success");
    }catch(error){
        console.error("Connect Error:", error.message);
    }
}
// kko bt thanh cong hay that bai nen tach ra
