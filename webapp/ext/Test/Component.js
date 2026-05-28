sap.ui.define(["sap/ovp/cards/custom/Component"],
function (CardComponent) {
    "use strict";

    return CardComponent.extend("overview.ext.Test.Component", {
    // use inline declaration instead of component.json to save 1 round trip
    metadata: {
        properties: {
        contentFragment: {
            type: "string",
            defaultValue: "overview.ext.Test.new",
        },
        headerFragment: {
            type: "string",
            defaultValue: "",
        },
        footerFragment: {
            type: "string",
            defaultValue: "",
        },
        },

        version: "${version}",

        library: "sap.ovp",

        includes: [],

        dependencies: {
        libs: ["sap.m"],
        components: [],
        },
        config: {},
        customizing: {
        "sap.ui.controllerExtensions": {
            "sap.ovp.cards.generic.Card": {
            controllerName: "overview.ext.Test.new",
            },
        },
        },
    },
    });
}
);