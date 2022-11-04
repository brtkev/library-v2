sap.ui.define([
  'sap/ui/core/mvc/Controller',
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
], function(Controller, JSONModel, MessageToast, History, UIComponent) {
  "use strict";

  let PageController = Controller.extend("root.controller.crud.Update", {


    onSearchId: function (oEvent){
      let search = oEvent.getParameter("query");
      let model = this.getView().getModel();
      
      if(this.getOwnerComponent().bookIdError(search)) return;
      
      const url = `/library/Books(${search})`

      fetch(url, { method: "GET" })
      .then(r => r.json()
      .then(data => {

        if(data.error) {
          MessageToast. show(`id ${search} not found!`)
          model.setData({...model.getData(), book : this.getOwnerComponent().getBookModel(), inputStatus : false})
        }

        else{

          model.setData({...model.getData(), book : data, inputStatus : true})
        }
      }))

      .catch(err => {
        console.log(err);
        MessageToast.show("Error happened searching for an id");
      })
    },

    onSubmit: function ( ){
      let book = this.getView().getModel().getData().book;

      if(this.getOwnerComponent().titleError(book.title)) return;

      const url = `/library/Books(${book.ID})`
      const headers = this.getOwnerComponent().getLibrary().getHeaders();

      delete book.ID;
      const body = JSON.stringify(book);

      fetch(url, { method: "PATCH" , headers, body}  )
      .then(r => r.json()
      .then(data => {

        MessageToast.show(`book ${data.ID} updated`);

        const model = this.getView().getModel();

        model.setData({...model.getData(), book : this.getOwnerComponent().getBookModel(), inputStatus : false})
      }))

      .catch(err => {
        MessageToast.show(`Error happened updating the book`);
      })
    },

    onNavBack: function(){
      return this.getOwnerComponent().onNavBack();
    }
  });

  return PageController;

});