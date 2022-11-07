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
      let ID = this.byId("deleteInput").getValue();

      if(this.getOwnerComponent().bookIdError(ID)) return;
      
      const url = `/library/Books(${ID})`
      fetch(url, { method: "DELETE" })
      .then( async r => {

        try {
          if((await r.json()).hasOwnAttribute("error")) MessageToast.show(`Error, no that Id doesn't exist`);
          else MessageToast.show(`book with id of ${ID} was deleted from the collection`);
        } catch (error) {
          MessageToast.show(`book with id of ${ID} was deleted from the collection`);
          this.byId("deleteInput").setValue("");
        }
      })
      .catch(err => {
        console.log(err)

        MessageToast.show(`Error, something happenede`);
      })
    },
    
    onNavBack: function(){
      return this.getOwnerComponent().onNavBack();
    },

    //not used
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