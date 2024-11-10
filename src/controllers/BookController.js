const nanoid = import('nanoid');
class BookController {
    constructor() {
        this.books = [
            // {
            //     // "id": "Qbax5Oy7L8WKf74l",
            //     "id": "ada",
            //     "name": "Buku A",
            //     "year": 2010,
            //     "author": "John Doe",
            //     "summary": "Lorem ipsum dolor sit amet",
            //     "publisher": "Dicoding Indonesia",
            //     "pageCount": 100,
            //     "readPage": 100,
            //     "finished": true,
            //     "reading": false,
            //     "insertedAt": "2021-03-04T09:11:44.598Z",
            //     "updatedAt": "2021-03-04T09:11:44.598Z"
            // },
        ];
    }

    index(req, res) {
        const { reading, finished, name } = req.query || {};

        let results = this.books;
        if (reading) results = this.books.filter((book) => book.reading == reading);
        if (finished) results = this.books.filter(book => book.finished === (finished == 1));
        if (name) results = this.books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));

        let resFormat = results.map(({ id, name, publisher }) => ({ id, name, publisher }));

        try {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({
                status: "success",
                data: {
                    books: resFormat || results
                }
            }));
        } catch (error) {
            console.error(error.message);
        }
    }

    show(id, res) {
        try {
            let result = this.books.find(value => value.id === id);
            if (!result) {
                res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ status: "fail", message: "Buku tidak ditemukan" }));
            }

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({
                status: "success",
                data: {
                    book: result
                }
            }));
        } catch (error) {
            console.error(error.message);
        }
    }

    store(req, res) {
        let newBook = [];
        try {
            req.on("data", (data) => {
                newBook += data;
            }).on("end", async () => {
                newBook = JSON.parse(newBook.toString());
                if (!newBook.name) {
                    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ status: "fail", message: "Gagal menambahkan buku. Mohon isi nama buku" }));
                }
                if (newBook.readPage > newBook.pageCount) {
                    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ status: "fail", message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount" }));
                }

                newBook = {
                    id: (await nanoid).nanoid(),
                    name: newBook.name,
                    year: parseInt(newBook.year),
                    author: newBook.author,
                    summary: newBook.summary,
                    publisher: newBook.publisher,
                    pageCount: parseInt(newBook.pageCount),
                    readPage: parseInt(newBook.readPage),
                    reading: newBook.reading,
                    finished: (newBook.pageCount === newBook.readPage),
                    insertedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                this.books.push(newBook);

                res.writeHead(201, {"Content-Type": "application/json; charset=utf-8"});
                return res.end(JSON.stringify({
                    status: "success",
                    message: "Buku berhasil ditambahkan",
                    data: {
                        bookId: newBook.id
                    }
                }));
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    update(id, req, res) {
        let updatedBook = [];
        try {
            req.on("data", (book) => {
                updatedBook += book;
            }).on("end", () => {
                let oldBookIndex = this.books.findIndex(value => value.id === id);
                updatedBook = JSON.parse(updatedBook.toString());
                if (!updatedBook.name) {
                    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ status: "fail", message: "Gagal memperbarui buku. Mohon isi nama buku" }));
                }
                if (updatedBook.readPage > updatedBook.pageCount) {
                    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ status: "fail", message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount" }));
                }
                if (!this.books[oldBookIndex]) {
                    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ status: "fail", message: "Gagal memperbarui buku. Id tidak ditemukan" }));
                }

                this.books[oldBookIndex] = {
                    ...this.books[oldBookIndex],
                    ...updatedBook,
                    finished: (updatedBook.readPage === this.books[oldBookIndex].pageCount),
                    updatedAt: new Date().toISOString()
                };

                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({
                    status: "success",
                    message: "Buku berhasil diperbarui"
                }));
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    destroy(id, res) {
        try {
            const haveBookId = this.books.findIndex(value => value.id === id);
            if (!this.books[haveBookId]) {
                res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ status: "fail", message: "Buku gagal dihapus. Id tidak ditemukan" }));
            }

            this.books.splice(haveBookId, 1);

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({
                status: "success",
                message: "Buku berhasil dihapus"
            }));
        } catch (error) {
            console.error(error.message);
        }
    }
}

module.exports = BookController;