require("dotenv").config();
const app = require("./app");

const { PORT } = process.env || 5500;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

start();
