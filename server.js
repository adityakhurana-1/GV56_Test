const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 8000;

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// Home page (Upload UI)
app.get("/", (req, res) => {
  res.send(`
    <h2>📂 Local File Server</h2>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
    <br/>
    <a href="/files">View Files</a>
  `);
});

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("✅ File uploaded successfully <br><a href='/'>Back</a>");
});

// List & download files
app.get("/files", (req, res) => {
  const fs = require("fs");
  const files = fs.readdirSync("uploads");

  let list = files.map(f =>
    `<li><a href="/download/${f}">${f}</a></li>`
  ).join("");

  res.send(`<h3>📁 Files</h3><ul>${list}</ul><a href="/">Back</a>`);
});

// Download
app.get("/download/:file", (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, "uploads", fileName);
  res.download(filePath, fileName);
});


// Listen on LAN
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://<YOUR-IP>:${PORT}`);
});
