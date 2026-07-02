import express from "express";
import cors from "cors";
import ordersRoutes from "./routes/orders.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", ordersRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "OmniAI API",
  });
});

export default app;