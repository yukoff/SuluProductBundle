define(["config"],function(a){"use strict";var b={product:1,"product-with-variants":2,"product-addon":3,"product-set":4},c="#product-form",d={supplierId:"#supplierField",autocompleteSupplierInstanceName:"supplier"};return{name:"Sulu Product Form",view:!0,templates:["/admin/product/template/product/form"],initialize:function(){this.saved=!0,this.status=this.options.data?this.options.data.attributes.status:a.get("product.status.active"),this.sandbox.emit("product.state.change",this.status),this.initializeValidation(),this.bindCustomEvents(),this.setHeaderBar(!0),this.render(),this.listenForChange()},bindCustomEvents:function(){this.sandbox.on("product.state.change",function(a){this.options.data&&this.options.data.attributes.status&&this.options.data.attributes.status.id===a||(this.status={id:a},this.setHeaderBar(!1))},this),this.sandbox.on("sulu.toolbar.save",function(){this.save()}.bind(this)),this.sandbox.on("sulu.toolbar.delete",function(){this.sandbox.emit("sulu.product.delete",this.sandbox.dom.val("#id"))}.bind(this)),this.sandbox.on("sulu.products.saved",function(){this.setHeaderBar(!0)},this)},initializeValidation:function(){this.sandbox.form.create(c)},save:function(){if(this.sandbox.form.validate(c)){var a,e=this.sandbox.form.getData(c);""===e.id&&delete e.id,e.status=this.status,!e.type&&this.options.productType&&(e.type={id:b[this.options.productType]}),a=this.sandbox.dom.attr("#"+d.autocompleteSupplierInstanceName,"data-id"),a&&"null"!==a&&(e.supplier={id:a}),this.sandbox.emit("sulu.products.save",e)}},render:function(){this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/product/template/product/form")),this.initSupplierAutocomplete(),this.initForm(this.options.data)},initForm:function(a){var b=this.sandbox.form.create(c);b.initialized.then(function(){this.setFormData(a)}.bind(this))},setFormData:function(a){a?this.sandbox.form.setData(c,a.toJSON()).then(function(){this.sandbox.start(c)}.bind(this)).fail(function(a){this.sandbox.logger.error("An error occured when setting data!",a)}.bind(this)):this.sandbox.start(c)},initSupplierAutocomplete:function(){var b=a.get("sulucontact.components.autocomplete.default.account");b.el=d.supplierId,b.value=this.options.data&&this.options.data.attributes.supplier?this.options.data.attributes.supplier:"",b.instanceName=d.autocompleteSupplierInstanceName,b.remoteUrl+="type=3",this.sandbox.start([{name:"auto-complete@husky",options:b}])},setHeaderBar:function(a){a!==this.saved&&(a?this.sandbox.emit("sulu.header.toolbar.item.disable","save",!0):this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1)),this.saved=a},listenForChange:function(){this.sandbox.dom.on("#product-form","change",function(){this.setHeaderBar(!1)}.bind(this),"select"),this.sandbox.dom.on("#product-form","keyup",function(){this.setHeaderBar(!1)}.bind(this),"input, textarea"),this.sandbox.on("sulu.content.changed",function(){this.setHeaderBar(!1)}.bind(this)),this.sandbox.on("husky.select.status.selected.item",function(){this.setHeaderBar(!1)}.bind(this)),this.sandbox.on("husky.select.orderUnit.selected.item",function(){this.setHeaderBar(!1)}.bind(this)),this.sandbox.on("husky.select.contentUnit.selected.item",function(){this.setHeaderBar(!1)}.bind(this)),this.sandbox.on("husky.select.contentUnit.deselected.item",function(){this.setHeaderBar(!1)}.bind(this)),this.sandbox.on("husky.select.deliveryStatus.selected.item",function(){this.setHeaderBar(!1)}.bind(this))}}});