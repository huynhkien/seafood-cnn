import React from 'react'
import {ProductPage, Slider, ProductDeal, ProductPageOne, ProductSale, Featured} from '../Index';

const Home = () => {
  return (
    <div>
      <Slider/>
      <Featured/>
      <ProductPage/>
      <ProductDeal/>
      <ProductPageOne/>
      <ProductSale/>
    </div>
  )
}

export default Home