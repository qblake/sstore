'use strict';
var React = require('react');
var _ = require('lodash');

var ProductPage = React.createClass({

  getInitialState: function() {
    return {
      quantity: 1,
    };
  },

  render: function() {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>{this.props.product.name}</div>
        <div className='panel-body'>
          <div className='row'>
            <div className='col-xs-12 col-md-8'>
              <p className='text-center'>
                <img src={this.props.product.imageUrl} alt={this.props.product.name} className='img-rounded'/>
              </p>
            </div>
            <div className='col-xs-12 col-md-4'>
              <div className='well well-sm'>
                <div>
                  Price {this.props.product.price} {this.props.profile.currencySuffix}
                </div>
                <form role='form'>
                  {this.renderOptions()}
                  <div className='form-group'>
                    <label htmlFor='quantity'>Quantity</label>
                    <input type='number' className='form-control' id='quantity' value={this.state.quantity} onChange={this.handlers.onQuantityChange.bind(this)}></input>
                  </div>
                </form>
                <button type='button' className='btn btn-default' onClick={this.handlers.onAddToCartClick.bind(this)}>Add to cart</button>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12 col-md-12' dangerouslySetInnerHTML={{__html: this.props.product.description}} />
          </div>
        </div>
      </div>
    );
  },

  renderOptions: function() {
    if (_.isEmpty(this.props.product.options)) return;
    var ops = _.map(this.props.product.options, function(option, index) {
      var inputs = '';
      switch (option.type) {
        //TODO: add more types
        case 'RADIO':
          inputs = this.getRadioChoices(option.choices);
          break;
        default:
      }
      return (
        <div key={'option' + index} className='form-group'>
          <label>{option.name}</label>
          {inputs}
        </div>
      );
    }.bind(this));
    return (
      <div>
        {ops}
      </div>
    );
  },

  getRadioChoices: function(choices) {
    //TODO: add select choice handling
    var result = _.map(choices, function(choice, index) {
      return (
        <div key={'choice' + index} className='radio'>
          <label>
            <input type='radio' name='optionsRadios' id={'optionsRadios'+index} value='option1'/>
              {choice.text}
          </label>
        </div>
      );
    });
    return result;
  },

  handlers: {
    onAddToCartClick: function() {
      if (this.props.onAddToCartClick) {
        this.props.onAddToCartClick(this.props.product, this.state.quantity);
      }
    },
    onQuantityChange: function(event) {
      if (event.target.value < 0) return;
      this.setState({
        quantity: event.target.value,
      });
    },
  },

});

module.exports = ProductPage;
