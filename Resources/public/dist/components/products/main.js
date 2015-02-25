define(["suluproduct/models/product","sulucategory/model/category","app-config","suluproduct/util/header","suluproduct/util/product-delete-dialog"],function(a,b,c,d,e){"use strict";var f={1:"product",2:"product-with-variants",3:"product-addon",4:"product-set"},g="sulu.products.",h=g+"new",i=g+"save",j=g+"delete",k=g+"import",l=g+"list",m=g+"variants.delete";return{initialize:function(){this.product=null,this.bindCustomEvents(),"list"===this.options.display?this.renderList():"tab"===this.options.display?this.renderTabs().then(function(){"variants"!==this.options.content&&d.initToolbar(this.sandbox,this.options.locale,this.product.get("status"))}.bind(this)):"import"===this.options.display&&this.renderImport()},bindCustomEvents:function(){this.sandbox.on(h,function(a){this.sandbox.emit("sulu.router.navigate","pim/products/"+c.getUser().locale+"/add/type:"+a)}.bind(this)),this.sandbox.on(i,function(a){this.save(a)}.bind(this)),this.sandbox.on(j,function(a){this.del(a)},this),this.sandbox.on("sulu.product.delete",function(a){this.deleteProduct(a)},this),this.sandbox.on(k,function(){this.sandbox.emit("sulu.router.navigate","pim/products/import")}.bind(this)),this.sandbox.on("husky.datagrid.item.click",function(a){this.load(a,c.getUser().locale)}.bind(this)),this.sandbox.on(l,function(){this.sandbox.emit("sulu.router.navigate","pim/products")}.bind(this)),this.sandbox.on("sulu.header.language-changed",function(a){this.load(this.options.id,a)},this),this.sandbox.on("sulu.products.products-overlay.variants.add",function(a,b){this.addVariant(a,b)},this),this.sandbox.on(m,function(a){this.deleteVariants(a)},this),this.sandbox.on("sulu.products.media.save",this.saveMedia.bind(this)),this.sandbox.on("sulu.products.workflow.triggered",this.triggerWorkflowAction.bind(this))},triggerWorkflowAction:function(a){if(a&&a.ids&&a.status){var b="/admin/api/products?action=changeState&ids="+a.ids+"&statusId="+a.status;this.sandbox.util.save(b,"POST").then(function(){this.sandbox.emit("sulu.product.workflow.completed")}.bind(this)).fail(function(a){this.sandbox.emit("sulu.labels.error.show",this.sandbox.translate("product.workflow.state.changed.error"),"labels.error",""),this.sandbox.logger.error("error while changing state of products",a)}.bind(this))}},saveMedia:function(a,b,c){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button"),this.processAjaxForMedia(b,a,"POST"),this.processAjaxForMedia(c,a,"DELETE")},processAjaxForMedia:function(a,b,c){var d,e=[],f=[];a.length>0&&(this.sandbox.util.each(a,function(a,g){"DELETE"===c?d="/admin/api/products/"+b+"/media/"+g:"POST"===c&&(d="/admin/api/products/"+b+"/media"),e.push(this.sandbox.util.ajax({url:d,data:{mediaId:g},type:c}).fail(function(){this.sandbox.logger.error("Error while saving media!")}.bind(this))),f.push(g)}.bind(this)),this.sandbox.util.when.apply(null,e).then(function(){"DELETE"===c?this.sandbox.emit("sulu.products.media.removed",f):"POST"===c&&this.sandbox.emit("sulu.products.media.saved",f)}.bind(this)))},save:function(a){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button"),this.product.set(a),this.product.get("categories").reset(),a.categories&&this.sandbox.util.foreach(a.categories,function(a){var c=b.findOrCreate({id:a});this.product.get("categories").add(c)}.bind(this)),this.product.saveLocale(this.options.locale,{success:function(b){var c=b.toJSON();a.id?this.sandbox.emit("sulu.products.saved",c):this.load(c.id,this.options.locale)}.bind(this),error:function(){this.sandbox.logger.log("error while saving product")}.bind(this)})},load:function(a,b){this.sandbox.emit("sulu.router.navigate","pim/products/"+b+"/edit:"+a+"/details")},del:function(b){this.confirmDeleteDialog(function(c){c&&this.sandbox.util.each(b,function(b,c){var d=a.findOrCreate({id:c});d.destroy({success:function(){this.sandbox.emit("husky.datagrid.record.remove",c)}.bind(this)})}.bind(this))}.bind(this))},deleteProduct:function(b){e.show(this.sandbox,a.findOrCreate({id:b}))},addVariant:function(a){this.product.get("variants").fetch({data:{id:a},type:"POST",success:function(b,c){delete c.parent,this.sandbox.emit("husky.datagrid.variants-datagrid.record.remove",a),this.sandbox.emit("husky.datagrid.record.add",c)}.bind(this)})},deleteVariants:function(a){this.confirmDeleteDialog(function(b){b&&this.product.get("variants").fetch({success:function(b){this.sandbox.util.each(a,function(a,c){var d=b.get(c);d.urlRoot=b.url()+"/",d.destroy({success:function(){this.sandbox.emit("sulu.products.variant.deleted",c)}.bind(this)})}.bind(this))}.bind(this)})}.bind(this))},confirmDeleteDialog:function(a){this.sandbox.emit("sulu.overlay.show-warning","sulu.overlay.be-careful","sulu.overlay.delete-desc",a.bind(this,!1),a.bind(this,!0))},renderTabs:function(){this.product=new a;var b=this.sandbox.dom.createElement("<div/>"),c={name:"products/components/content@suluproduct",options:{el:b,locale:this.options.locale}},d=this.sandbox.data.deferred();return this.html(b),this.options.id?(c.options.content=this.options.content,c.options.id=this.options.id,this.product.set({id:this.options.id}),this.product.fetchLocale(this.options.locale,{success:function(a){c.options.data=a.toJSON(),c.options.productType=f[a.get("type").id],this.sandbox.start([c]),d.resolve()}.bind(this),error:function(){this.sandbox.logger.error("error while fetching product"),d.reject()}.bind(this)})):(this.sandbox.emit("sulu.header.toolbar.item.change","workflow","inactive"),c.options.productType=this.options.productType,this.sandbox.start([c]),d.resolve()),d.promise()},renderList:function(){var a=this.sandbox.dom.createElement('<div id="products-list-container"/>');this.html(a),this.sandbox.start([{name:"products/components/list@suluproduct",options:{el:a}}])},renderImport:function(){var a=this.sandbox.dom.createElement('<div id="products-import"/>');this.html(a),this.sandbox.start([{name:"products/components/import@suluproduct",options:{el:a}}])}}});