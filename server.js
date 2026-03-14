import express from "express";

const port = 8000;

const app = express();

app.use("/public", express.static("public"));
app.use("/src", express.static("src"));

app.get("/{:any}", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
