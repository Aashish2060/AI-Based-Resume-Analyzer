require('dotenv').config();

const app = require('./src/app');
const connectToDB = require('./src/config/database');

connectToDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });