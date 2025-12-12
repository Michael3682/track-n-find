import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import routes from "@/routes"
import { setupSwagger } from "./swagger";
import { initializeSocket } from "./socket";
import { createSuperAdmin } from "./scripts";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

setupSwagger(app)
createSuperAdmin()

app.use("/api", routes)

const server = initializeSocket(app)

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});