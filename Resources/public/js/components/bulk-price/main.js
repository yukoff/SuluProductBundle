/*
 * This file is part of the Sulu CMS.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */
/**
 * @class bulk-price@suluproduct
 * @constructor
 *
 * @param {Object} [options] Configuration object
 * @param {Array}  [options.data] Array of data [object]
 * @param {Array}  [options.instanceName] string instance name
 */
define(['text!suluproduct/components/bulk-price/bulk-price.html'], function(BulkPriceTemplate) {

    'use strict';

    var constants = {
            minimumQuantity: 0,
            maxBulkElements: 4,
            bulkPriceIdPrefix: 'bulk-price-'
        },

        eventNamespace = 'sulu.products.bulk-price.',

        /** returns normalized event names */
        createEventName = function(postFix) {
            return eventNamespace + (this.options.instanceName ? this.options.instanceName + '.' : '') + postFix;
        },

        /**
         * @event sulu.products.bulk-price.initialized
         * @description Emitted when component is initialized
         */
        INITIALIZED = function() {
            return createEventName.call(this, 'initialized');
        },

        /**
         * Returns the sales price and splits salesprice from prices array (price with minimum quantity 0)
         * additionally formats prices according locale
         * @param prices
         * @returns price
         */
        getSalesPriceAndRemoveFromPrices = function(prices) {
            var salesPrice = null,
                idx = null;

            this.sandbox.util.foreach(prices, function(price, index) {
                if (parseFloat(price.minimumQuantity) === constants.minimumQuantity && idx === null) {
                    salesPrice = price;
                    idx = index;
                }

                if (!!price.minimumQuantity || price.minimumQuantity === 0) {
                    price.minimumQuantity = this.sandbox.numberFormat(parseFloat(price.minimumQuantity), 'n');
                } else {
                    price.minimumQuantity = '';
                }

                if (!!price.price || price.price === 0) {
                    price.price = this.sandbox.numberFormat(price.price, 'n');
                } else {
                    price.price = '';
                }

            }.bind(this));

            // remove sales price
            if (idx !== null) {
                prices.splice(idx, 1);
            }
            return salesPrice;
        },

        addEmptyObjects = function(prices) {
            var i = prices.length;

            if (i < constants.maxBulkElements) {
                for (; i < constants.maxBulkElements; i++) {
                    prices.push({});
                }
            }

            return prices;
        },

        bindDomEvents = function() {
            this.sandbox.dom.on(this.$el, 'change', function() {
                refreshData.call(this);
            }.bind(this), 'input, .pickdate');
            this.sandbox.dom.on(this.$el, 'blur', function() {
                this.sandbox.emit("sulu.content.changed");
            }.bind(this), 'input');
        },

        refreshData = function() {
            // get sales price
            var priceItems = [],
                $salesPrice = this.sandbox.dom.find('.salesprice', this.$el),
                salesPriceValue = this.sandbox.dom.val($salesPrice),
                salesPriceId = this.sandbox.dom.data($salesPrice, 'id'),
                salesPrice,

                $prices = this.sandbox.dom.find('.table tbody tr', this.$el),
                priceValue, priceQuantity, priceId;

            // update sales price
            if (!!salesPriceValue) {
                salesPrice = {
                    price: !!salesPriceValue ? this.sandbox.parseFloat(salesPriceValue) : null,
                    minimumQuantitiy: constants.minimumQuantity,
                    id: !!salesPriceId ? salesPriceId : null,
                    currency: this.options.currency
                };
                priceItems.push(salesPrice);
            }

            // bulk prices
            this.sandbox.util.foreach($prices, function($price) {
                priceId = this.sandbox.dom.data($price, 'id');
                priceQuantity = this.sandbox.dom.val(this.sandbox.dom.find('input.minimumQuantity', $price));
                priceValue = this.sandbox.dom.val(this.sandbox.dom.find('input.price', $price));

                if (!!priceQuantity && !!priceValue) {
                    priceItems.push({
                        minimumQuantity: this.sandbox.parseFloat(priceQuantity),
                        price: this.sandbox.parseFloat(priceValue),
                        currency: this.options.currency,
                        id: !!priceId ? priceId : null
                    });
                }
            }.bind(this));

            var $specialPriceStart = this.sandbox.dom.find('#js-husky-input-startDate' + this.options.currency.code),
                $specialPriceEnd = this.sandbox.dom.find('#js-husky-input-endDate' + this.options.currency.code),
                $specialPrice = this.sandbox.dom.find('#js-input' + this.options.currency.code),
                specialPrice = {};
            
            specialPrice.currency = {};
            specialPrice.startDate = this.sandbox.dom.val($specialPriceStart);
            specialPrice.endDate = this.sandbox.dom.val($specialPriceEnd);
            specialPrice.price = this.sandbox.parseFloat(this.sandbox.dom.val($specialPrice));
            specialPrice.currency = this.options.currency;

            this.sandbox.dom.data(this.$el, 'itemsSpecialPrice', specialPrice);
            this.sandbox.dom.data(this.$el, 'items', priceItems);
            this.sandbox.emit('sulu.products.bulk-price.changed');
        },

        initDateComponents = function(tmplSelectors) {
            this.sandbox.start([
                {
                    name: 'input@husky',
                    options: {
                        el: '#' + tmplSelectors.startDateHolder,
                        instanceName: tmplSelectors.startDate,
                        inputId: tmplSelectors.startDate,
                        skin: 'date'
                    }
                }
            ]);
            this.sandbox.start([
                {
                    name: 'input@husky',
                    options: {
                        el: '#' + tmplSelectors.endDateHolder,
                        instanceName: tmplSelectors.endDate,
                        inputId: tmplSelectors.endDate,
                        skin: 'date'
                    }
                }
            ]);
        },

        getPricesForCurrency = function(prices, currencyCode) {
            var pricesForCurrency = [];
            this.sandbox.util.foreach(prices, function(price) {
                if (price.currency.code === currencyCode) {
                    pricesForCurrency.push(price);
                }
            }.bind(this));

            return pricesForCurrency;
        },

        getSpecialPriceForCurrency = function(specialPrices, currencyCode) {
            var specialPriceForCurrency = {};

            this.sandbox.util.foreach(specialPrices, function(specialPrice) {
                if (specialPrice.currency.code === currencyCode) {
                    specialPriceForCurrency = specialPrice;
                    return;
                }
            }.bind(this));

            return specialPriceForCurrency;
        };

    return {

        initialize: function() {
            var prices = [],
                salesPrice,
                specialPrice = {},
                tmplSelectors = {};
            this.groupedPrices = {};
            var currencyCode = this.options.currency.code;

            if (this.options.data.attributes.prices) {
                prices = getPricesForCurrency.call(
                    this,
                    this.options.data.attributes.prices.slice(0),
                    currencyCode
                );
                salesPrice = getSalesPriceAndRemoveFromPrices.call(this, prices);
            }

            if (this.options.data.attributes.specialPrices) {
                specialPrice = getSpecialPriceForCurrency.call(
                    this,
                    this.options.data.attributes.specialPrices.slice(0),
                    currencyCode
                );
                specialPrice.price = this.sandbox.numberFormat(specialPrice.price, 'n');
            }

            tmplSelectors.price = "js-input" + currencyCode;
            tmplSelectors.startDate = "js-husky-input-startDate" + currencyCode;
            tmplSelectors.endDate = "js-husky-input-endDate" + currencyCode;
            tmplSelectors.startDateHolder = "js-husky-startDate-holder" + currencyCode;
            tmplSelectors.endDateHolder = "js-husky-endDate-holder" + currencyCode;
            specialPrice.tmplSelectors = tmplSelectors;

            prices = addEmptyObjects.call(this, prices);
            bindDomEvents.call(this);

            this.render(prices, salesPrice, specialPrice);
            refreshData.call(this);
            initDateComponents.call(this, tmplSelectors);
            this.sandbox.emit(INITIALIZED.call(this));
        },

        render: function(prices, salesPrice, specialPrice) {
            var data = {
                    idPrefix: constants.bulkPriceIdPrefix,
                    currency: this.options.currency,
                    salesPrice: salesPrice,
                    translate: this.sandbox.translate,
                    prices: prices,
                    specialPrice: specialPrice
                },
                $el = this.sandbox.util.template(BulkPriceTemplate, data);
            this.sandbox.dom.append(this.options.el, $el);
        }
    };
});
