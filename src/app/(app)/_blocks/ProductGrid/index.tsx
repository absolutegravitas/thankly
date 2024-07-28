/**
 * @file index.tsx
 * @module ProductGrid
 * @description This module renders a grid of product cards on the ecommerce website.
 * @overview
 * The ProductGrid component is a React functional component that takes an array of products as a prop.
 * It renders a section element with a grid layout, where each grid item is a ProductCard component displaying
 * details of a specific product. This component is responsible for displaying all available products in a
 * visually appealing grid format, making it easy for users to browse and view different products.
 */

import React from 'react'
import { Product } from '@payload-types'
import { ProductCard } from '@app/_components/ProductCard'

export type ProductGridProps = { products: Product[] }

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <React.Fragment>
      <section
        aria-labelledby="products-heading"
        className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
      >
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
          {products?.map((product, index) => {
            return <ProductCard key={index} {...product} />
          })}
        </div>
      </section>
    </React.Fragment>
  )
}

export default ProductGrid
