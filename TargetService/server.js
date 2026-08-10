import express from "express";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  res.json({
    service: "User Service",
    users: [
      { id: 1, name: "John" },
      { id: 2, name: "Alice" }
    ]
  });
});

app.listen(8000, () => {
  console.log("User Service running on :8000");
});
