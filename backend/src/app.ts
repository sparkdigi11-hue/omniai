import express from "express";
import cors from "cors";

import ordersRoutes from "./routes/orders.routes";
import aiEmployeesRoutes from "./routes/aiEmployees.routes";
import csvRoutes from "./routes/csv.routes";
import knowledgeRoutes from "./routes/knowledge.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", ordersRoutes);
app.use("/ai-employees", aiEmployeesRoutes);
app.use("/csv", csvRoutes);
app.use("/knowledge", knowledgeRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "OmniAI API",
  });
});

export default app;