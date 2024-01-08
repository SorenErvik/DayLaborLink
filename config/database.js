


const mongoose = require("mongoose");

/**
 * @description Connect to MongoDB database
 */

const connectDB = async () => {
  try {
    // Connect to MongoDB using the provided connection string
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    // Log successful connection to the database
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log and exit the process if an error occurs during database connection
    console.error(err);
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
