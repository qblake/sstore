'use strict';
var React = require('react');
var _ = require('lodash');

var CartStorage = require('../storages/CartStorage');

var Cart = React.createClass({

  render: function() {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>Cart</div>
        <div className='panel-body'>
          {this.renderProducts()}
        </div>
      </div>
    );
  },

  renderProducts: function() {
    var items = CartStorage.getItems();
    if (_.isEmpty(items)) {
      return (
        <div>{'No items in cart :('}</div>
      );
    }
    var items = _.map(items, function(item, index) {
      return (
        <tr key={'item'+index}>
          <td>{item.product.name}</td>
          <td>{item.product.price}</td>
          <td>
            <input type='number' className='form-control' value={item.quantity} onChange={this.handlers.onQuantityChange.bind(this, item.product)}></input>
          </td>
          <td>{item.product.price * item.quantity}</td>
          <td>
            <button type='button' className='btn btn-danger' onClick={this.handlers.onRemoveClick.bind(this, item.product)}>
              <span className='glyphicon glyphicon-trash'></span>
            </button>
          </td>
        </tr>
      );
    }.bind(this));
    return (
      <div className='table-responsive'>
        <table className='table table-hover'>
          <tr>
            <th>Product name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th/>
          </tr>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  },

  handlers: {
    onQuantityChange: function(product, event) {
      CartStorage.setQuantityForProduct(product.id, event.target.value);
      this.forceUpdate();
    },
    onRemoveClick: function(product) {
      CartStorage.removeProduct(product.id);
      this.forceUpdate();
    },
  },

});

module.exports = Cart;
