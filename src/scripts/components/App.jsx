/** @jsx React.DOM */

'use strict';
var React = require('react');
var CategoriesService = require('../services/CategoriesService');
var ProductsService = require('../services/ProductsService');
var _ = require('lodash');
var Q = require('q');

var App = React.createClass({

  getInitialState: function() {
    var state = {
      categories: [],
      currentCategoryId: 0,
      breadcrumbs: [],
      productsInCart: [],
    };
    return state;
  },

  componentWillMount: function() {
    CategoriesService.loadRootCategories().then(function(categories) {
      console.log('categories', categories);
      this.setState({
        categories: categories
      })
    }.bind(this));
  },

  render: function() {
    return (
      <div className='container' >
        {this.renderNavbar()}

        {this.renderBreadcrumbs()}
        {this.renderCategories()}
        {this.renderProducts()}
        {this.renderProduct()}
        {this.renderCart()}
      </div>
    );
  },

  renderNavbar: function() {
    return (
      <nav className="navbar navbar-default" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Special store</a>
          </div>
        </div>
      </nav>
    );
  },

  renderBreadcrumbs: function() {
    if (!this.state.breadcrumbs) return;
    return (
      <ol className="breadcrumb">
        <li><a href="#">Home</a></li>
        <li><a href="#">Category1</a></li>
        <li className="active">Category2</li>
      </ol>
    );
  },

  renderCategories: function() {
    if (!this.state.categories) return;
    var categories = _.map(this.state.categories, function(category) {
      return (
        <div key={'category' + category.id} className='col-sm-6 col-md-3' >
          <div className='thumbnail'>
            <a href="#" className="thumbnail" onClick={this.handlers.onCategorySelect.bind(this, category.id)}>
              <img src={category.thumbnailUrl} alt={category.name} className="img-rounded"/>
            </a>
            <div className="caption">
              <h4><p className='text-center'>{category.name}</p></h4>
            </div>
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Categories</div>
        <div className="panel-body">
          {categories}
        </div>
      </div>
    );
  },

  renderProducts: function() {
    if (!this.state.products) return;
    var products = _.map(this.state.products, function(product) {
      return (
        <div key={'product' + product.id} className='col-sm-6 col-md-3' >
          <div className='thumbnail'>
            <a href="#" className="thumbnail" onClick={this.handlers.onProductSelect.bind(this, product.id)}>
              <img src={product.thumbnailUrl} alt={product.name} className="img-rounded"/>
            </a>
            <div className="caption">
              <h4><p className='text-center'>{product.name}</p></h4>
            </div>
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Products</div>
        <div className="panel-body">
          {products}
        </div>
      </div>
    );

  },

  renderProduct: function() {
    console.log('renderProduct', this.state.currentProduct);
    if (!this.state.currentProduct) return;
    var product = this.state.currentProduct;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{product.name}</div>
        <div className="panel-body">
          <button type="button" className="btn btn-default" onClick={this.handlers.onAddToCartClick.bind(this, product)}>Add to cart</button>
        </div>
      </div>
    );
  },

  renderCart: function() {
    if (_.isEmpty(this.state.productsInCart)) {
      return <p>No items in cart</p>
    }
    var itemsCount = _.size(this.state.productsInCart);
    return (
      <div>{itemsCount + ' items in cart'}</div>
    );
  },

  handlers: {
    onCategorySelect: function(categoryId, event) {
      console.log('categoryId', categoryId);
      Q.all([
        CategoriesService.loadCategories(categoryId),
        ProductsService.loadProductsInCategory(categoryId),
      ]).then(function(data) {
        console.log('data', data);
        this.setState({
          categories: data[0],
          currentCategoryId: categoryId,
          products: data[1],
        })
      }.bind(this));
      event.preventDefault();
    },

    onProductSelect: function(productId, event) {
      ProductsService.loadProduct(productId).then(function(data) {
        console.log('data', data);
        this.setState({
          currentProductId: productId,
          currentProduct: data,
        });
      }.bind(this));
      event.preventDefault();
    },

    onAddToCartClick: function(product) {
      var productsInCart = this.state.productsInCart;
      productsInCart.push({
        product: productsInCart,
        count: 1,
      });
      this.setState({
        productsInCart: productsInCart
      });
    }
  },
});

module.exports = App;
