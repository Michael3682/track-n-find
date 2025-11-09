import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "@/routes"

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use("/api", routes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});