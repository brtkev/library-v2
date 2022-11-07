sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
], function(Controller, MessageToast){
	"use strict";

	return Controller.extend("root.controller.crud.Search", {
		onInit: function() {
		
		},
		onSearch: function(oEvent){
			let model = this.getView().getModel(),
				search = oEvent.getParameter("query"),
				attribute = this.byId("select").getSelectedItem().getKey();

			model.setData({...model.getData(), books: []})
			if(search){
				let url;
				if(attribute == 'ID'){
					url = `/library/Books(${search})`
				}
				else {
					
					let filter = `contains(${attribute},\'${search}\')`
	
					url = "/library/Books?" + new URLSearchParams({
						$count : true,
						$filter : filter
					})
				}

				fetch(url, { method: "GET" })
				.then(r => r.json()
				.then(data => {
					if(data.hasOwnProperty('error')) throw data;
					
					if( data["@odata.count"] > 0 || attribute == 'ID'){
						let msgFlag = false;
						model.setData({
							...model.getData(),
						books : attribute == 'ID' ? [data] :
							data.value.map(book => {
								if(book.source == 'google ebooks') msgFlag = true;
								return book;
							})
						})	

						if(msgFlag) MessageToast.show("click an element to add it to the collection")
					}else{
						MessageToast.show("No books found")
					}
				}))
				.catch(err => MessageToast.show("No books found")) 

			}
		},
		onPress: function(oEvent) {
			let oItem = oEvent.getSource();
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			let itemPath = oItem.getBindingContext().getPath().substr(1)

			let i = parseInt(itemPath.split('/')[1]) ;
			
			const model = this.getView().getModel();
			let book = model.getData().books[i];
			
			if(book.source != "library database"){
				oRouter.navTo("create", {
					bookPath: window.encodeURIComponent(itemPath)
				})
				
			}

		},

		onGoogleSearchButtonPress: function(){
			let model = this.getView().getModel();
			modelFromGoogle(this.byId("searchField").getValue(), model).then(() => {
				MessageToast.show("click an element to add it to the collection")
				// this.byId("createHint").setVisible(true)
				// this.byId("googleSearchButton").setVisible(false)
			})
			.catch((err) => MessageToast.show(err))
		},
		onNavBack: function(){
			return this.getOwnerComponent().onNavBack();
		}
	})
})

async function modelFromGoogle(query, model){
	const googleUrl = "https://www.googleapis.com/books/v1/volumes?" + new URLSearchParams({
		q: query
	})
	fetch(googleUrl, {method: "GET"})
	.then(r => r.json()
	.then(data => {
		model.setData({
			...model.getData(),
			books: [...model.getData().books, ...googleBooksFilter(data) ]
		})
	}))
}

function googleBooksFilter(data){
	let books = data.items.slice(0,50);
	return books.map(book => {
		let info = book.volumeInfo;
		let thumbnail = "";
		if(info.imageLinks && info.imageLinks.hasOwnProperty("thumbnail")){
			thumbnail = info.imageLinks.thumbnail;
		}
		return {
			title: info.title,
			subtitle: info.subtitle,
			descr: info.description,
			authors: info.authors,
			categories: info.categories,
			imageLink: thumbnail,
			publishDate: info.publishedDate,
			editorial: info.publisher	,
			source: "google ebooks"
		}
	})

}