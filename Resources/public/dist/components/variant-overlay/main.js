define(["config","suluproduct/models/product","text!suluproduct/components/variant-overlay/details.html","text!suluproduct/components/variant-overlay/prices.html","text!suluproduct/components/variant-overlay/warning.html"],function(a,b,c,d,e){"use strict";var f={currencies:[],data:{},instanceName:null,locale:null,variantAttributes:[],parentPrices:[]},g={form:"#js-variant-form",overlayContent:".variant-overlay-content"},h="sulu.product-variant-overlay.",i=function(){return k.call(this,"closed")},j=function(){return k.call(this,"initialized")},k=function(a){return h+l.call(this)+a},l=function(){var a="";return"string"==typeof this.options.instanceName&&(a+="."),a},m=function(){this.sandbox.on(w.call(this,"language-changed"),p.bind(this)),this.sandbox.on(w.call(this,"closed"),n.bind(this))},n=function(){this.sandbox.stop(this.$el),this.sandbox.emit(i.call(this))},o=function(){this.sandbox.dom.on(this.$el,"click",t.bind(this),".change-price")},p=function(a){this.changeLocale=a,this.sandbox.emit(w.call(this,"slide-right"))},q=function(){return this.sandbox.emit(w.call(this,"slide-left")),s.call(this,this.changeLocale),!1},r=function(){this.sandbox.emit(w.call(this,"slide-left"));var a=this.sandbox.sulu.locales;return this.sandbox.emit("husky.select.null.update",a,[a.indexOf(this.options.locale)],!1),!1},s=function(a){this.options.locale=a,A.call(this)},t=function(a){var b=$(a.target).data("currencyCode"),c=$("#price-"+b),d=!1;c.prop("disabled",function(a,b){return d=!b}),d?(this.sandbox.form.updateConstraint(g.form,c,"required"),c.val("")):(this.sandbox.form.addConstraint(g.form,c,"required",!0),c.focus())},u=function(){return[{title:this.sandbox.translate("public.details"),data:this.sandbox.dom.createElement(_.template(c,{translate:this.sandbox.translate}))},{title:this.sandbox.translate("content-navigation.product.pricing"),data:this.sandbox.dom.createElement(_.template(d,{translate:this.sandbox.translate}))}]},v=function(){var a=this.sandbox.dom.createElement('<div id="js-variant-form"/>');this.sandbox.dom.append(this.$el,a);var b=this.sandbox.translate("sulu_product.variant-overlay.title");this.options.data.id&&(b=this.sandbox.translate("sulu_product.variant-overlay.title-edit"));this.sandbox.start([{name:"overlay@husky",options:{el:a,supportKeyInput:!1,title:b,skin:"normal",openOnStart:!0,removeOnClose:!0,instanceName:this.options.instanceName,slides:[{title:b,tabs:u.call(this),languageChanger:{locales:this.sandbox.sulu.locales,preSelected:this.options.locale},propagateEvents:!1,okCallback:J.bind(this)},{title:this.sandbox.translate("sulu_product.variant-overlay.warning-title"),data:this.sandbox.dom.createElement(_.template(e,{translate:this.sandbox.translate})),okCallback:q.bind(this),cancelCallback:r.bind(this)}]}}]);this.sandbox.once(w.call(this,"opened"),function(){A.call(this),this.sandbox.emit(j.call(this))}.bind(this))},w=function(a){return"husky.overlay."+l.call(this)+a},x=function(){var a=$.Deferred();if(this.options.data&&this.options.data.id){var c=b.findOrCreate({id:this.options.data.id});c.fetchLocale(this.options.locale,{success:function(b){a.resolve(b.toJSON())}.bind(this),error:function(){a.reject(),console.error("Error while fetching product data")}})}else a.resolve();return a.promise()},y=function(){$(g.overlayContent).addClass("is-hidden"),this.sandbox.emit(w.call(this,"show-loader"))},z=function(){$(g.overlayContent).removeClass("is-hidden"),this.sandbox.emit(w.call(this,"hide-loader"))},A=function(){this.options.data&&this.options.data.id&&y.call(this),x.call(this).then(function(a){a||(a={attributes:D.call(this)}),H.call(this,a),B.call(this,a)}.bind(this))},B=function(a){this.form||(this.form=this.sandbox.form.create(g.form)),this.form.initialized.then(C.bind(this,a))},C=function(a){this.sandbox.form.setData(g.form,a).then(function(){z.call(this)}.bind(this))},D=function(){var a=[];return this.sandbox.util.foreach(this.options.variantAttributes,function(b){a.push({attributeId:b.id,attributeName:b.name})}),a},E=function(a,b){var c=null;return a&&a.prices&&a.prices.length&&this.sandbox.util.foreach(a.prices,function(a){return a.currency.id===b?(c=a,!1):void 0}),c},F=function(a){if(this.options.parentPrices&&this.options.parentPrices.length){var b=null;this.sandbox.util.foreach(this.options.parentPrices,function(c){return c.currency.id===a&&0===parseInt(c.minimumQuantity)?(b=c,!1):void 0}.bind(this))}return b},G=function(a){var b="-",c=F.call(this,a);return c&&c.hasOwnProperty("price")&&(b=this.sandbox.numberFormat(c.price,"n2")),b},H=function(a){var b=[];this.sandbox.util.foreach(this.options.currencies,function(c){var d=E.call(this,a,c.id);d?d.hasOwnProperty("price")||(d.price=null):d={price:null,currency:c},d.basePrice=G.call(this,c.id),b.push(d)}.bind(this)),a.prices=b},I=function(a){this.sandbox.util.foreach(a.attributes,function(a){a.attributeId=parseInt(a.attributeId)});var b=[];this.sandbox.util.foreach(a.prices,function(a){""!=a.price&&(a.price=parseInt(a.price),b.push(a))}),a.prices=b},J=function(){if(!this.sandbox.form.validate(g.form))return!1;var a=this.sandbox.form.getData(g.form);I.call(this,a),"function"==typeof this.options.okCallback&&this.options.okCallback.call(this,a,this.options.locale)};return{initialize:function(){this.changeLocale=null,this.options=this.sandbox.util.extend(!0,{},f,this.options),v.call(this),m.call(this),o.call(this)}}});