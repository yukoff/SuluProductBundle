define(["config"],function(a){"use strict";var b=function(a){a?this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1):this.sandbox.emit("sulu.header.toolbar.item.disable","save",!0)},c=function(){this.sandbox.once("husky.toolbar.header.initialized",e.bind(this,this.status)),this.sandbox.off("product.state.change"),this.sandbox.on("product.state.change",d.bind(this))},d=function(a){this.status.id!==a.id&&(this.status=a,b.call(this,!0),e.call(this,a))},e=function(b){var c,d=this.sandbox.translate(a.get("product.status.inactive").key),e="husky-test";b&&b.id!==a.get("product.status.active").id||(d=this.sandbox.translate(a.get("product.status.active").key),e="husky-publish"),c={title:d,icon:e},this.sandbox.emit("sulu.header.toolbar.button.set","productWorkflow",c)};return{initToolbar:function(a,b){this.sandbox=a,this.status=b,c.call(this,b),e.call(this,b)},getSelectedStatus:function(){return this.status},setSaveButton:function(a){b.call(this,a)}}});