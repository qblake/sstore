'use strict';
var React = require('react');
/* Services */
var CategoriesService = require('../services/CategoriesService');
var ProductsService = require('../services/ProductsService');
var ProfileService = require('../services/ProfileService');

var CartStorage = require('../storages/CartStorage');

var ProductPage = require('./ProductPage.jsx');
var Cart = require('./Cart.jsx');

var _ = require('lodash');
var Q = require('q');

var App = React.createClass({

  ROOT_CATEGORY_ID: 0,

  getInitialState: function() {
    var state = {
      categories: [],
      breadcrumbs: [],
      productsInCart: [],
      displayState: 'catalog',
    };
    return state;
  },

  componentWillMount: function() {
    this.loadDataInCategory(this.ROOT_CATEGORY_ID);
    this.loadProfile();
    CartStorage.onItemsCountChange(function() {
      this.forceUpdate();
    }.bind(this));
  },

  render: function() {
    return (
      <div className='container'>
        {this.renderNavbar()}
        <div className='container'>
          {this.renderBreadcrumbs()}
          {this.renderCatalog()}
          {this.renderProduct()}
          {this.renderCart()}
        </div>
      </div>
    );
  },

  renderNavbar: function() {
    var storeName = this.state.profile ? this.state.profile.storeName : '' ;
    return (
      <nav className='navbar navbar-default navbar-fixed-top' role='navigation'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#' onClick={this.handlers.onHomeClick.bind(this)}>
            {storeName}
          </a>
          <div className='cart' onDrop={this.handlers.onDropToCart.bind(this)} onDragOver={this.handlers.onDragOverCart.bind(this)}>
            <p className='navbar-text navbar-right'>
              <small>{'Drag product here -> '}</small>
              <a href='#' onClick={this.handlers.onShowPageClick.bind(this, 'cart')} className='navbar-link'>
                <span className='glyphicon glyphicon-shopping-cart'> </span>
                Shopping Cart <span className="badge">{CartStorage.getProductsCount()}</span>
              </a>
            </p>
          </div>
        </div>
      </nav>
    );
  },

  renderBreadcrumbs: function() {
    if (this.nowShowing('cart')) { return; }
    if (!this.state.breadcrumbs) return;
    var size = _.size(this.state.breadcrumbs);
    var crumbs = _.map(this.state.breadcrumbs, function(category, index) {
      var needDisableLastItem = index == (size - 1) && !this.nowShowing('product');
      if (needDisableLastItem) {
        return (
          <li key={'breadcrumb' + category.id} className='active'>
            {category.name}
          </li>
        );
      }
      return (
        <li key={'breadcrumb' + category.id}>
          <a href="#" onClick={this.handlers.onBreadcrumbClick.bind(this, category.id)}>{category.name}</a>
        </li>
      );
    }.bind(this));
    return (
      <ol className='breadcrumb'>
        <li key='store'><a href="#" onClick={this.handlers.onHomeClick.bind(this)}>Store</a></li>
        {crumbs}
      </ol>
    );
  },

  renderCatalog: function() {
    if (!this.nowShowing('catalog')) { return; }
    return (
      <div>
        {this.renderInfoMessage()}
        {this.renderCategories()}
        {this.renderProducts()}
      </div>
    );
  },

  renderInfoMessage: function() {
    if (_.isEmpty(this.state.products) && _.isEmpty(this.state.categories)) {
      return (
        <div className=''>
          <p className='text-center'>
            No products in this category. <a href="#" onClick={this.handlers.onHomeClick.bind(this)}>Continue shopping</a>
          </p>
        </div>
      );
    }
  },

  renderCategories: function() {
    return this.renderItems('Categories', this.state.categories, this.handlers.onCategorySelect);
  },

  renderProducts: function() {
    var draggable = true;
    return this.renderItems('Products', this.state.products, this.handlers.onProductSelect, draggable);
  },

  renderItems: function(label, items, handler, draggable) {
    if (_.isEmpty(items)) return;
    var products = _.map(items, function(product) {
      return (
        <div key={'product' + product.id} className='col-sm-6 col-md-3' draggable={draggable} onDragStart={this.handlers.onDragStart.bind(this, product)}>
          <div className='thumbnail'>
            <a href="#" className='thumbnail' onClick={handler.bind(this, product.id)}>
              <img src={product.thumbnailUrl} alt={product.name} className='img-responsive'/>
            </a>
            <div className='caption'>
              <h4><p className='text-center'>{product.name}</p></h4>
            </div>
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>{label}</div>
        <div className='panel-body'>
          {products}
        </div>
      </div>
    );
  },

  renderProduct: function() {
    if (!this.nowShowing('product')) { return; }
    if (!this.state.currentProduct) { return; }
    var product = this.state.currentProduct;
    return (
      <ProductPage
        profile={this.state.profile}
        product={this.state.currentProduct}
        onAddToCartClick={this.handlers.onAddToCartClick.bind(this)}
      />
    );
  },

  renderCart: function() {
    if (!this.nowShowing('cart')) { return; }
    return (
      <Cart
        onHomeClick={this.handlers.onHomeClick.bind(this)}
      />
    );
  },

  handlers: {
    onCategorySelect: function(categoryId, event) {
      this.loadDataInCategory(categoryId);
      this.addBreadcrumb(categoryId);
      event.preventDefault();
    },

    onProductSelect: function(productId, event) {
      ProductsService.loadProduct(productId).then(function(data) {
        this.setState({
          currentProductId: productId,
          currentProduct: data,
          displayState: 'product',
        });
      }.bind(this));
      event.preventDefault();
    },

    onAddToCartClick: function(product, quantity) {
      var data = {
        product: product,
        quantity: quantity,
      };
      CartStorage.addProduct(data);
    },

    onShowPageClick: function(pageName) {
      this.showPage(pageName);
    },

    onHomeClick: function() {
      this.loadDataInCategory(this.ROOT_CATEGORY_ID);
      this.clearBreadcrumbs();
      this.showPage('catalog');
    },

    onBreadcrumbClick: function(categoryId) {
      this.removeBreadcrumbAfter(categoryId);
      this.loadDataInCategory(categoryId);
      this.showPage('catalog');
    },
    onDragStart: function(product, event) {
      event.dataTransfer.setData('text', product.id);
    },
    onDragOverCart: function(event) {
      event.preventDefault();
    },
    onDropToCart: function(event) {
      event.preventDefault();
      var productId = parseInt(event.dataTransfer.getData('text'));
      var product = _.find(this.state.products, {id: productId});
      if (!product) return;
      CartStorage.addProduct({
        product: product,
        quantity: 1,
      });
    },
  },

  nowShowing: function(stateName) {
    return this.state.displayState == stateName;
  },

  showPage: function(pageName) {
    this.setState({
      displayState: pageName
    });
  },
  loadDataInCategory: function(categoryId) {
    Q.all([
      CategoriesService.loadCategories(categoryId),
      ProductsService.loadProductsInCategory(categoryId),
    ]).then(function(data) {
      this.setState({
        categories: data[0],
        products: data[1],
      });
    }.bind(this));
  },

  loadProfile: function() {
    ProfileService.loadProfile().then(function(data) {
      this.setState({
        profile: data
      });
    }.bind(this));
  },

  addBreadcrumb: function(categoryId) {
    var breadcrumbs = this.state.breadcrumbs;
    breadcrumbs.push(_.find(this.state.categories, {id: categoryId}));
    this.setState({
      breadcrumbs: breadcrumbs,
    });
  },

  removeBreadcrumbAfter: function(categoryId) {
    var index = _.findIndex(this.state.breadcrumbs, {id: categoryId});
    var breadcrumbs = this.state.breadcrumbs.slice(0, index+1);
    this.setState({
      breadcrumbs: breadcrumbs,
    });
  },

  clearBreadcrumbs: function() {
    this.setState({
      breadcrumbs: [],
    });
  },


});

module.exports = App;
