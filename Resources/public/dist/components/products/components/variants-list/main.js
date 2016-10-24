define(["suluproduct/collections/currencies","suluproduct/models/variant","suluproduct/util/header"],function(a,b,c){"use strict";var d={datagridInstanceName:"variants",toolbarInstanceName:"variants"},e=function(){this.sandbox.sulu.initListToolbarAndList.call(this,"product-variants-list","/admin/api/product-variants/fields",{el:"#list-toolbar",instanceName:d.toolbarInstanceName,small:!1,template:this.sandbox.sulu.buttons.get({add:{options:{id:"add",icon:"plus-circle",callback:r.bind(this)}},"delete":{options:{id:"delete",icon:"trash-o",disabled:!0,callback:k.bind(this)}}})},{el:"#product-variants",actionCallback:n.bind(this),instanceName:d.datagridInstanceName,resultKey:"products",searchFields:["name"],url:"/admin/api/products/"+this.options.data.id+"/variants?flat=true&locale="+this.options.locale})},f=function(){this.options.data.attributes.status=c.getSelectedStatus(),this.sandbox.emit("sulu.products.save",this.options.data.attributes,!0)},g=function(){this.sandbox.on("sulu.toolbar.save",f.bind(this)),this.sandbox.on("sulu.products.saved",c.setSaveButton.bind(this,!1)),this.sandbox.on("husky.datagrid."+d.datagridInstanceName+".number.selections",h.bind(this,d.toolbarInstanceName)),this.sandbox.on("sulu.product-variant-overlay.closed",i.bind(this))},h=function(a,b){var c=b>0?"enable":"disable";this.sandbox.emit("husky.toolbar."+a+".item."+c,"delete",!1)},i=function(){this.sandbox.stop(this.$overlay)},j=function(){this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/product/template/product/variants")),e.call(this)},k=function(){var a=[];this.sandbox.emit("husky.datagrid."+d.datagridInstanceName+".items.get-selected",function(b){a=b});var c=a.length;if(!(1>c)){var e=new b({productId:this.options.data.id,ids:a});e.destroy({success:l.bind(this),error:m.bind(this)})}},l=function(){q.call(this),this.sandbox.emit("sulu.labels.success.show","labels.success.delete-desc","labels.success"),this.sandbox.emit("husky.datagrid."+d.datagridInstanceName+".selected.update")},m=function(){this.sandbox.emit("sulu.labels.error.show","sulu_product.labels.delete-error","labels.error")},n=function(a,b){r.call(this,b)},o=function(){var b=$.Deferred(),c=new a({locale:this.options.locale});return c.fetch({success:function(a){this.currencies=a.toJSON(),b.resolve()}.bind(this),error:function(){console.error("Error while loading currencies"),b.reject()}}),b.promise()},p=function(a,c){var d=b.findOrCreate({id:a.id,productId:this.options.data.id,locale:c});d.save(a,{success:function(){q.call(this),this.sandbox.emit("sulu.labels.success.show","labels.success.save-desc","labels.success")}.bind(this),error:function(){this.sandbox.emit("sulu.labels.error.show","sulu_product.labels.save-error","labels.error")}.bind(this)})},q=function(){this.sandbox.emit("husky.datagrid."+d.datagridInstanceName+".update")},r=function(a){this.currenciesLoaded.then(function(){this.$overlay=this.sandbox.dom.createElement("<div>"),this.sandbox.dom.append(this.$el,this.$overlay),this.sandbox.start([{name:"variant-overlay@suluproduct",options:{el:this.$overlay,data:a,currencies:this.currencies,locale:this.options.locale,parentPrices:this.options.data.attributes.prices,variantAttributes:this.options.data.attributes.variantAttributes,okCallback:p.bind(this)}}])}.bind(this))};return{view:!0,templates:["/admin/product/template/product/variants"],initialize:function(){this.$overlay=null,this.currencies=[],this.currenciesLoaded=o.call(this),this.status=this.options.data.attributes.status,this.sandbox.emit("product.state.change",this.status),j.call(this),g.call(this)}}});