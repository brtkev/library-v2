module.exports = (srv) => {

    const { Books, Authors } = cds.entities('my.library')


    srv.on('CREATE', 'Books', async (req, next) => {

        let res = await srv.run(SELECT.from(Books).orderBy('ID desc').limit(1));

        let idCount = res[0].ID + 1
        req.query.INSERT.entries = req.query.INSERT.entries.map(entry => {
            entry.ID = idCount;
            idCount++;
            return entry;
        })

        return next(req);
    })

    //?
    srv.on('READ', 'Books', async (req, next) => {
        
        let res = await cds.run(req.query);
        
        if (!res) {
            req.error( 404, "not found");
            return;
        }


        if (res.length == 0 && req.query.SELECT.search) {
            const search = req.query.SELECT.search.reduce(searchReduce, "");
            res = await booksFromGoogle(search)
        }

        if (req.query.SELECT.count) res.$count = res.length;

        req.reply(res)


    })


    // Add some discount for overstocked books
    srv.after('READ', 'Books', each => {
        if (!each.source) each.source = 'library database';

    })
}


async function booksFromGoogle(search) {
    const googleUrl = "https://www.googleapis.com/books/v1/volumes?" + new URLSearchParams({
        q: search
    })
    try {
        let books = await (await fetch(googleUrl, { method: "GET" })).json()
        return googleBooksFilter(books)
    } catch (error) {
        console.log(error)
        return []
    }

}

function googleBooksFilter(data) {
    let books = data.items.slice(0, 29);
    return books.map(book => {
        let info = book.volumeInfo;
        let thumbnail = null;
        if (info.imageLinks && info.imageLinks.hasOwnProperty("thumbnail")) {
            thumbnail = info.imageLinks.thumbnail;
        }

        const authors = info.authors ? info.authors.reduce((prev, auth) => {
            if (prev == "") return auth;
            else return prev + "," + auth;
        }, "") : ""

        const categories = info.categories ? info.categories.reduce((prev, cat) => {
            if (prev == "") return cat;
            else return prev + "," + cat;
        }, "") : ""

        return {
            title: info.title,
            subtitle: info.subtitle || null,
            descr: info.description ? info.description : null,
            authors: authors,
            categories: categories,
            imageLink: thumbnail,
            publishDate: info.publishedDate || null,
            editorial: info.publisher || null,
            source: "google ebooks"
        }
    })

}

function searchReduce(prev, curr, i) {
    if (curr == 'and') return prev;

    if (prev == "") return curr.val;

    else return prev + " " + curr.val;
}