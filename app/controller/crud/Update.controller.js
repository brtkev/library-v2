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
      
      if(this.getOwnerComponent().bookIdError(search)) return;
      
      const url = "/api/search?" + new URLSearchParams({
        search,
        attribute : 'book_id'
      });
      fetch(url, { method: "GET" })
      .then(r => r.json()
      .then(data => {
        if(data.length > 0){
          let model = this.getView().getModel();
          model.setData({...model.getData(), ...{book : data[0], inputStatus : true}})
        }else{
          MessageToast.show(`id ${search} not found!`)
        }
      }))
      .catch(err => {
        console.log(err);
        MessageToast.show("Error happened searching for an id");
      })
    },

    onSubmit: function ( ){
      let data = this.getView().getModel().getData();

      if(this.getOwnerComponent().titleError(data.book.title)) return;

      const url = "/api/update?" + new URLSearchParams(data.book);
      fetch(url, { method: "PUT" })
      .then(r => r.json()
      .then(data => {
        MessageToast.show(`book ${data.book_id} updated`);
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
        }, inputStatus : false})
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