module.exports = (srv) => {

    const { Books, Authors } = cds.entities('my.library')

    //?
    srv.on('READ', 'Books', async (req, next) => {
        
        try {
            if(req.query.SELECT.search) {
                let res = await cds.run(req.query);    
                if(res.length == 0){
                    const search = req.query.SELECT.search.reduce( searchReduce, "");
                    res = await booksFromGoogle(search)
                    
                }

                if(req.query.SELECT.count) res.$count = res.length;
                
                req.reply(res)
                
            }else throw "Error: query is empty"
        } catch (e) {
            console.log(e)
        }
        
    })

    // srv.on('READ', 'Books/$count')

    // Add some discount for overstocked books
    srv.after('READ', 'Books', each => {
        if (!each.source) each.source = 'library database';
        
    })
}


async function booksFromGoogle(search){
	const googleUrl = "https://www.googleapis.com/books/v1/volumes?" + new URLSearchParams({
		q: search
	})
	let books =  await (await fetch(googleUrl, {method: "GET"})).json()
    return googleBooksFilter(books)
    
}

function googleBooksFilter(data){
	let books = data.items.slice(0,29);
	return books.map(book => {
		let info = book.volumeInfo;
		let thumbnail = null;
		if(info.imageLinks && info.imageLinks.hasOwnProperty("thumbnail")){
			thumbnail = info.imageLinks.thumbnail;
		}
        
        const authors = info.authors ? info.authors.map( auth => { 
            return { 'author' : { "name" : auth, 'ID' : '-1'}, 'author_ID' : '-1', 'book_ID': '-1'}
        }) : []
        
        const categories = info.categories ? info.categories.map( cat => { 
            return { 'category' : { "name" : cat, 'ID' : '-1'}, 'category_ID' : '-1', 'book_ID' : '-1'}
        }) : []

		return {
            ID: '-1',
			title: info.title,
			subtitle: info.subtitle || null,
			descr: info.description ? info.description.slice(0, 99) : null,
			authors: authors,
			categories: categories,
			imageLink: thumbnail,
			publishDate: info.publishedDate || null,
			editorial: info.publisher || null,
			source: "google ebooks"
		}
	})

}

function searchReduce(prev, curr, i){
    if(curr == 'and' ) return prev;

    if(prev == "") return curr.val;

    else return  prev + " " + curr.val;  
}