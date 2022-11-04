
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], (Controller, UIComponent) => {
	"use strict";
	return Controller.extend("root.App", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (e) {
			let routeName = e.getParameter("name");
			const book = this.getOwnerComponent().getBookModel()
			if (routeName == "update") {
				let model = this.getView().getModel();
				model.setData({ ...model.getData(), book, inputStatus: false })


			} else if (routeName == "create") {
				let model = this.getView().getModel();
				model.setData({ ...model.getData(), book, inputStatus: true })


			}
		}

	});
})