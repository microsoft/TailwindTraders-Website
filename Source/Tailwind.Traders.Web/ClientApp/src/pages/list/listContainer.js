import React, { Component, Fragment } from 'react';

import { LoadingSpinner } from '../../shared/index';

import List from './list';
import { ProductService } from '../../services';

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typesList: [],
      brandsList: [],
      productsList: [],
      queryString: '',
      loading: true,
    };

    this.queryString = [
      {
        brand: [],
        type: [],
      },
    ];
    this.type = [];
    this.brand = [];
  }

  async componentDidMount() {
    const filter = this.props.match.params.code || '';
    const filteredProductsPageData = await this.getProductData(filter);
    this.setPageState(filteredProductsPageData);
  }

  async componentDidUpdate(prevProps) {
    const code = this.props.match.params.code;
    if (code !== prevProps.match.params.code) {
      const filteredProductsPageData = await this.getProductData(code);
      this.setPageState(filteredProductsPageData);
    }
  }

  async getProductData(type) {
    const filter = type === '' ? {} : (this.queryString.type = { type });
    const filteredProductsPageData = await ProductService.getFilteredProducts(filter);

    return filteredProductsPageData.data;
  }

  setPageState(filteredProductsPageData) {
    if (filteredProductsPageData === undefined) {
      return;
    }
    const typesList = filteredProductsPageData.types;
    const brandsList = filteredProductsPageData.brands;
    const productsList = filteredProductsPageData.products;
    this.setState({ productsList, typesList, brandsList, loading: false });
  }

  onFilterChecked = async (e, value) => {
    const isChecked = e.target.checked;
    const dataType = e.target.getAttribute('id');
    this.setQueryStringState(isChecked, dataType, value);

    const apiCall = await ProductService.getFilteredProducts(this.queryString);
    this.setState({ productsList: apiCall.data.products });
  };

  setQueryStringState(isChecked, dataType, value) {
    if (isChecked) {
      if (value === 'type') {
        this.type.push(dataType);
        this.queryString.type = this.type;
      } else {
        this.brand.push(dataType);
        this.queryString.brand = this.brand;
      }
    } else {
      let index = this.queryString[value].indexOf(dataType);
      if (index !== -1) {
        this.queryString[value].splice(index, 1);
      }
    }
  }

  render() {
    const { loading, typesList, brandsList, productsList } = this.state;
    return (
      <Fragment>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <List
            onFilterChecked={this.onFilterChecked}
            typesList={typesList}
            brandsList={brandsList}
            productsList={productsList}
          />
        )}
      </Fragment>
    );
  }
}

export default ListContainer;
