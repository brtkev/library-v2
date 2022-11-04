

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  let PageController = Controller.extend("root.controller.crud.Create", {
    onInit: function(){
      var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("create").attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched : function(e){
      if(window.decodeURIComponent(e.getParameter("arguments").bookPath) != '{}'){
				let i = window.decodeURIComponent(e.getParameter("arguments").bookPath).split('/')[1];

        i = parseInt(i.slice(0, i.length-1));

        const model = this.getView().getModel();

        let book = model.getData().books[i];

        model.setData({...model.getData(), book, inputStatus : false})
			}
    },

    onSubmit: function ( ){
      let data = this.getView().getModel().getData();

      if(this.getOwnerComponent().titleError(data.book.title)) return;

      Object.keys(data.book).forEach( key => {
        if(data.book[key] == "" ) delete data.book[key]
        
      })


      const url = "/library/Books";

      const body =  JSON.stringify(data.book);

      const headers = {
        "OData-Version": "4.0",
        "Content-Type": "application/json;odata.metadata=minimal",
        "Accept": "application/json"
      }
      
      fetch(url, { method: "POST", body, headers  })
      .then(r => r.json()
      .then(data => {
        MessageToast.show(`book was added to the collection with the id ${data.ID}`);

        const model = this.getView().getModel();

        model.setData({...model.getData(), book : this.getOwnerComponent().getBookModel(), inputStatus : true})
      }))
      .catch(err => {
        MessageToast.show(`Error happened creating the book`);
      })
    },

    onNavBack: function(){
      return this.getOwnerComponent().onNavBack();
    }
  });

  return PageController;

});

