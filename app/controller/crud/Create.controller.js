sap.ui.define([
  'sap/ui/core/mvc/Controller',
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
], function(Controller, JSONModel, MessageToast, History, UIComponent) {
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

      const url = "/api/create?" + new URLSearchParams(data.book);
      fetch(url, { method: "POST" })
      .then(r => r.json()
      .then(data => {
        MessageToast.show(`book was added to the collection with the id ${data.book_id}`);
        const model = this.getView().getModel();
        model.setData({...model.getData(), book : {
          book_id : "",
          title : "",
          subtitle : "",
          description : "",
          printdate : "",
          editorial: "",
          img : "",
          categories : "",
          authors: ""
        }, inputStatus : true})
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