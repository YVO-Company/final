import mongoose from 'mongoose';
const uri = "mongodb://yvocompany_db_user:yvopass123@ac-cexn8ei-shard-00-00.zmey5ng.mongodb.net:27017/yvo?ssl=true&authSource=admin";
const conn = await mongoose.connect(uri);
const admin = conn.connection.db.admin();
const info = await admin.command({ isMaster: 1 });
console.log("ReplicaSet:", info.setName);
process.exit(0);
