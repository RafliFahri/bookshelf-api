const url = require("url");
const BookController = require("../controllers/BookController");
const {on} = require("nodemon");

const bookController = new BookController();

const routes = (req, res) => {
    const parsedPathUrl = url.parse(req.url, true);
    const method = req.method;
    const pathTo = parsedPathUrl.pathname.split("/");
    const id = pathTo.length > 2 ? pathTo[2] : null;

    req.query = parsedPathUrl.query;

    if (pathTo[1] === "books") {
        if (method === "GET" && id) bookController.show(id, res);
        else if (method === "GET") bookController.index(req, res);
        else if (method === "POST") bookController.store(req, res);
        else if (method === "PUT" && id) bookController.update(id, req, res);
        else if (method === "DELETE" && id) bookController.destroy(id, res);
        else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ status: "fail", message: "Metode tidak ditemukan" }));
        }
    } else {
        res.statusCode = 404;
        return res.end(JSON.stringify({ status: "fail", message: "Halaman tidak ditemukan" }));
    }
};

module.exports = routes;