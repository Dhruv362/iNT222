/**
 * Database configuration
 */
module.exports = {
  development: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/homework-grading',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }
  },
  test: {
    url: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/homework-grading-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  production: {
    url: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      retryWrites: true,
      w: 'majority'
    }
  }
};
