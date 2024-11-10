const http = require('http');
const routes = require("./routes/books");

/*const requestListener = (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    response.statusCode = 200;
    response.end('<h1>Halo HTTP Server!</h1>');
}*/

const server = http.createServer((req, res) => {
    routes(req, res);
});

const PORT = process.env.APP_PORT || 9000;

server.listen(PORT, () => {
    console.log(`Server Listening on http://localhost:${PORT}`);
});