require('dotenv').config();

// DEBUG - remove after fixing
console.log("API KEY being used:", process.env.GOOGLE_GENAI_API_KEY?.slice(0, 10) + "...")

const app = require('./src/app');
const connectToDB = require('./src/config/database');

connectToDB();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});