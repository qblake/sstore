'use strict';
var React = require('react/addons');
var _ = require('lodash');

var CartStorage = require('../storages/CartStorage');

var Catalog = React.createClass({

  getInitialState: function() {
    var state = {
      categoriesView: localStorage.getItem('categoriesView') || 'grid',
      productsView: localStorage.getItem('productsView') || 'grid',
    };
    return state;
  },

  render: function() {
    return (
      <div>
        {this.renderInfoMessage()}
        {this.renderCategories()}
        {this.renderProducts()}
      </div>
    );
  },

  renderInfoMessage: function() {
    if (_.isEmpty(this.props.products) && _.isEmpty(this.props.categories)) {
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
    return this.renderItems('categories', this.props.onCategorySelect);
  },

  renderProducts: function() {
    var draggable = true;
    return this.renderItems('products', this.props.onProductSelect, draggable);
  },

  renderItems: function(type, handler, draggable) {
    var items = this.props[type];
    var label = type;
    if (_.isEmpty(items)) return;
    var products = _.map(items, function(product) {
      switch (this.state[type + 'View']) {
        case 'grid':
          return this.renderGridItem(product, handler, draggable);
          break;
        case 'list':
          return this.renderListItem(product, handler, draggable);
          break;
      }
    }.bind(this));
    var cx = React.addons.classSet;
    var gridButtonStyle = cx({
      'btn btn-default': true,
      'active': this.state[type + 'View'] == 'grid',
    });
    var listButtonStyle = cx({
      'btn btn-default': true,
      'active': this.state[type + 'View'] == 'list',
    });
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          {label}
          <div className='btn-group btn-group-xs pull-right' role="group">
            <button type='button' className={gridButtonStyle} title={'Grid'} onClick={this.handlers.onViewSelect.bind(this, type, 'grid')}>
              <span className='glyphicon glyphicon-th-large' aria-hidden='true'></span>
            </button>
            <button type="button" className={listButtonStyle} title={'List'} onClick={this.handlers.onViewSelect.bind(this, type, 'list')}>
              <span className='glyphicon glyphicon-th-list' aria-hidden='true'></span>
            </button>
          </div>
        </div>

        <div className='panel-body'>
          {products}
        </div>
      </div>
    );
  },

  renderGridItem: function(product, handler, draggable) {
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
  },

  renderListItem: function(product, handler, draggable) {
    var imgUrl = product.smallThumbnailUrl || product.thumbnailUrl;
    return (
      <div key={'product' + product.id} className='media' draggable={draggable} onDragStart={this.handlers.onDragStart.bind(this, product)}>
        <a href="#" className='media-left' onClick={handler.bind(this, product.id)}>
          <img src={imgUrl} alt={product.name} className='img-thumbnail img-responsive'/>
        </a>
        <div className='media-body media-middle'>
          <h4 className='media-heading'>{product.name} <small>{product.sku}</small></h4>
        </div>
      </div>
    );
  },

  handlers: {
    onHomeClick: function() {
      if (this.props.onHomeClick) {
        this.props.onHomeClick();
      }
    },
    onDragStart: function(product, event) {
      event.dataTransfer.setData('text', product.id);
    },
    onViewSelect: function(type, view, event) {
      switch (type) {
        case 'categories':
          this.setState({
            categoriesView: view
          });
          localStorage.setItem('categoriesView', view);
          break;
        case 'products':
          this.setState({
            productsView: view
          });
          localStorage.setItem('productsView', view);
          break;
      }
    },
  },

});

module.exports = Catalog;
