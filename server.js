const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  let filePath = path.join(__dirname, "preview.html");
  if (url === "/login" || url === "/login.html") {
    filePath = path.join(__dirname, "login.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Erreur lors du chargement de la page.");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur AlFasle actif sur http://localhost:${PORT}`);
});
