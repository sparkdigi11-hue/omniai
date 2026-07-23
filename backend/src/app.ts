import express from "express";
import cors from "cors";

import ordersRoutes from "./routes/orders.routes";
import aiEmployeesRoutes from "./routes/aiEmployees.routes";
import csvRoutes from "./routes/csv.routes";
import knowledgeRoutes from "./routes/knowledge.routes";
import aiEngineRoutes from "./routes/aiEngine.routes";
import conversationsRoutes from "./routes/conversations.routes";
import productsRoutes from "./routes/products.routes";
import callsRoutes from "./routes/calls.routes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", ordersRoutes);
app.use("/ai-employees", aiEmployeesRoutes);
app.use(
  "/recordings",
  express.static(path.join(process.cwd(), "public/recordings"))
);
app.use("/products", productsRoutes);
app.use("/calls", callsRoutes);
app.use("/csv", csvRoutes);
app.use("/knowledge", knowledgeRoutes);
app.use("/ai-engine", aiEngineRoutes);
app.use("/conversations", conversationsRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "OmniAI API",
  });
});

export default app;