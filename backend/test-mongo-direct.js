import mongoose from 'mongoose';
const uri = "mongodb://yvocompany_db_user:yvopass123@ac-cexn8ei-shard-00-00.zmey5ng.mongodb.net:27017/yvo?ssl=true&authSource=admin";
mongoose.connect(uri)
    .then(() => {
        console.log("Connected successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection failed:", err);
        process.exit(1);
    });
