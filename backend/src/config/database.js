const mongoose = require('mongoose');

const connectDB = async () => {
    // await mongoose.connect("mongodb+srv://navaloli007:jmb66j1K4GOT1D9Z@cluster0.fjs2y.mongodb.net/?appName=Cluster0");
    await mongoose.connect("mongodb+srv://navaloli007:jmb66j1K4GOT1D9Z@cluster0.fjs2y.mongodb.net/devtinder");
    
};

module.exports = connectDB;