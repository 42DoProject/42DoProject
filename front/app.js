import * as http from "http";

var app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("hello world");
});
app.listen(3000, () => {
  console.log("front http://localhost:3000/");
});