sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast){
  "use strict";
  return Controller.extend("root.controller.Tiles", {
    onUpdatePress: function(oEvent){

      let oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("update");
    },
    onCreatePress: function(){
      let oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("create");
      
    },
    onDeletePress: function(){
      let oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("delete");  
    },
    onSearchPress: function(){
      let oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("search");  
    }
  });
});