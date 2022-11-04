module.exports = (srv) => {

    // const { Books, Authors } = cds.entities('my.library')

    //?
    srv.on('READ', 'Books', async (req, next) => {

        let res = await cds.run(req.query);    
        if(res.length == 0 && req.query.SELECT.search){
            const search = req.query.SELECT.search.reduce( searchReduce, "");
            res = await booksFromGoogle(search)
        }

        if(req.query.SELECT.count) res.$count = res.length;
        
        req.reply(res)
            
        
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
    try {
        let books =  await (await fetch(googleUrl, {method: "GET"})).json()
        return googleBooksFilter(books)
    } catch (error) {
        console.log(error)
        return []
    }
    
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
            return { 'author' : { "name" : auth}}
        }) : []
        
        const categories = info.categories ? info.categories.map( cat => { 
            return { 'category' : { "name" : cat}}
        }) : []

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

function searchReduce(prev, curr, i){
    if(curr == 'and' ) return prev;

    if(prev == "") return curr.val;

    else return  prev + " " + curr.val;  
}