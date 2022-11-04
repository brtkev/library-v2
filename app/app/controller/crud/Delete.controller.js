sap.ui.define([
  'sap/ui/core/mvc/Controller',
  "sap/m/MessageToast",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
], function(Controller, MessageToast, History, UIComponent) {
  "use strict";

  let PageController = Controller.extend("root.controller.crud.Delete", {

    onDelete: function ( e){
      // let book_id = e.getParameter("value");
      let book_id = this.byId("deleteInput").getValue();

      if(this.getOwnerComponent().bookIdError(book_id)) return;
      
      const url = "/api/remove?" + new URLSearchParams({book_id});
      fetch(url, { method: "DELETE" })
      .then(r => r.json()
      .then(data => {
        MessageToast.show(`book with id of ${book_id} was deleted from the collection`);

      }))
      .catch(err => {

        MessageToast.show(`Error, no that Id doesn't exist`);
      })
    },
    
    onNavBack: function(){
      return this.getOwnerComponent().onNavBack();
    },

    truncate: function(){
      fetch("/api/truncate", {
        method: "DELETE"
      }).then(r => {
        MessageToast.show("all books were deleted");
        const model = this.getView().getModel();
        model.setData({...model.getData(), books : []})
      })
    }
  });

  return PageController;

});