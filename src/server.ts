import app from "./app";
import pool from "./db";

const { PORT } = process.env;

pool
  .connect()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Database connection successful, server port ${PORT}`);
    })
  )
  .catch((error: Error) => {
    console.log(error.message);
    process.exit(1);
  });
