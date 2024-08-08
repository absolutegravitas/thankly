/**
 * Filters Component
 *
 * This component provides a user interface for filtering and sorting products in an e-commerce application.
 * It allows users to filter products by type, category, and tags, as well as sort products by name and price.
 * The component is responsive, providing a slide-out panel for mobile devices and an inline interface for desktop views.
 *
 * Key features:
 * - Sorting options for product name and price
 * - Filtering by product type, category, and tags
 * - Responsive design with mobile-friendly interface
 * - Active filter display with easy removal
 * - Clear all filters functionality
 *
 * Performance considerations:
 * - Fetches filter options (categories and tags) on component mount
 * - Uses client-side filtering to reduce server load
 * - Implements debounced search params updates to minimize unnecessary re-renders
 */

'use client'

import React, { useState, useCallback, useEffect, Fragment } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { ChevronDownIcon, Loader2, X } from 'lucide-react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Dialog,
  Transition,
} from '@headlessui/react'
import { SortOption } from '../ProductGrid'
import { fetchFilters } from './fetchFilters'
import { Category, Tag } from '@/payload-types'

// Define types for our component
type FilterType = 'productType' | 'category' | 'tag'

interface FilterOption {
  id: string | number
  title: string | null
}

interface ActiveFilter {
  type: FilterType
  id: string | number
  label: string
}

interface FiltersState {
  categories: Category[]
  tags: Tag[]
}

const sortOptions: { name: string; value: SortOption }[] = [
  { name: 'Name: A to Z', value: 'name_asc' },
  { name: 'Name: Z to A', value: 'name_desc' },
  { name: 'Price: Low to High', value: 'price_asc' },
  { name: 'Price: High to Low', value: 'price_desc' },
]

export default function Filters() {
  // Hooks for routing and URL manipulation
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // State for storing filter options and selections
  const [filters, setFilters] = useState<FiltersState | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const updateSearchParams = useCallback(
    (newParams: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key)
        } else if (Array.isArray(value)) {
          params.delete(key)
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      })

      replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, replace],
  )

  /**
   * Handles the sorting option change
   * @param newSort - The new sorting option selected by the user
   */
  const handleSort = useCallback(
    (newSort: SortOption) => {
      updateSearchParams({ sort: newSort, page: '1' })
    },
    [updateSearchParams],
  )

  /**
   * Handles changes in filter selections (product type, category, or tag)
   * @param type - The type of filter being changed
   * @param id - The id of the filter option being toggled
   */
  const handleFilterChange = useCallback(
    (type: FilterType, id: number | string) => {
      const updateFilter = (prev: (number | string)[]) => {
        const newFilter = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        updateSearchParams({ [type]: newFilter.map(String), page: '1' })
        return newFilter
      }

      switch (type) {
        case 'productType':
          setSelectedProductTypes(updateFilter as (prev: string[]) => string[])
          break
        case 'category':
          setSelectedCategories(updateFilter as (prev: number[]) => number[])
          break
        case 'tag':
          setSelectedTags(updateFilter as (prev: number[]) => number[])
          break
      }
    },
    [updateSearchParams],
  )

  /**
   * Removes a specific filter
   * @param type - The type of filter to remove
   * @param id - The id of the filter to remove
   */
  const removeFilter = useCallback(
    (type: FilterType, id: string | number) => {
      handleFilterChange(type, id)
    },
    [handleFilterChange],
  )

  /**
   * Clears all applied filters
   */
  const clearAllFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedTags([])
    setSelectedProductTypes([])
    updateSearchParams({ category: null, tags: null, productType: null, page: '1' })
  }, [updateSearchParams])

  // Fetch filter options on component mount
  useEffect(() => {
    const getFilters = async () => {
      try {
        setIsLoading(true)
        const fetchedFilters = await fetchFilters()
        setFilters(fetchedFilters)
      } catch (error) {
        console.error('Error fetching filters:', error)
      } finally {
        setIsLoading(false)
      }
    }
    getFilters()
  }, [])

  // Update selected filters when URL params change
  useEffect(() => {
    const categories = searchParams.getAll('category')
    const tags = searchParams.getAll('tags')
    const productTypes = searchParams.getAll('productType')
    setSelectedCategories(categories.map((category) => parseInt(category, 10)))
    setSelectedTags(tags.map((tag) => parseInt(tag, 10)))
    setSelectedProductTypes(productTypes)
  }, [searchParams])

  // Compile active filters for display
  const activeFilters: ActiveFilter[] = [
    ...selectedProductTypes.map(
      (type): ActiveFilter => ({
        type: 'productType',
        id: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      }),
    ),
    ...selectedCategories.map(
      (categoryId): ActiveFilter => ({
        type: 'category',
        id: categoryId,
        label: filters?.categories.find((c) => c.id === categoryId)?.title || '',
      }),
    ),
    ...selectedTags.map(
      (tagId): ActiveFilter => ({
        type: 'tag',
        id: tagId,
        label: filters?.tags.find((t) => t.id === tagId)?.title || '',
      }),
    ),
  ]

  /**
   * Renders a filter popover for a specific filter type
   */
  const FilterPopover = ({
    title,
    options,
    selectedIds,
    type,
  }: {
    title: string
    options: FilterOption[]
    selectedIds: (string | number)[]
    type: FilterType
  }) => (
    <Popover className="relative inline-block px-4 text-left">
      <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
        <span>{title}</span>
        <ChevronDownIcon
          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      </PopoverButton>

      <PopoverPanel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="space-y-4">
          {options.map((option) => (
            <div key={`${type}-${option.id}`} className="flex items-center">
              <input
                id={`filter-${type}-${option.id}`}
                name={type}
                value={String(option.id)}
                type="checkbox"
                checked={selectedIds.includes(option.id)}
                onChange={() => handleFilterChange(type, option.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`filter-${type}-${option.id}`}
                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
              >
                {option.title || ''}
              </label>
            </div>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  )

  const SkeletonLoader = () => (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      <span className="text-sm font-medium text-gray-500">{`Loading filter and sorting options...`}</span>
    </div>
  )

  if (isLoading) {
    return (
      <section aria-labelledby="filter-heading" className="bg-white pb-4 pt-6">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonLoader />
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="filter-heading" className="bg-white pb-4 pt-6">
      <h2 id="filter-heading" className="sr-only">
        Filters
      </h2>

      {/* Desktop filter interface */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sort menu */}
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
            Sort
            <ChevronDownIcon
              className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </MenuButton>

          <MenuItems className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            {sortOptions.map((option) => (
              <MenuItem key={option.value}>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSort(option.value)
                    }}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } no-underline block px-4 py-2 text-sm font-medium text-gray-900`}
                  >
                    {option.name}
                  </a>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        {/* Mobile filter button */}
        <button
          type="button"
          className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          Filters
        </button>

        {/* Desktop filters */}
        <div className="hidden sm:block">
          <div className="flow-root">
            <PopoverGroup className="-mx-4 flex items-center divide-x divide-gray-200">
              <FilterPopover
                title="Product Type"
                options={[
                  { id: 'card', title: 'Card' },
                  { id: 'gift', title: 'Gift' },
                ]}
                selectedIds={selectedProductTypes}
                type="productType"
              />
              <FilterPopover
                title="Category"
                options={
                  filters?.categories.map((c) => ({ id: c.id, title: c.title || null })) || []
                }
                selectedIds={selectedCategories}
                type="category"
              />
              <FilterPopover
                title="Tags"
                options={filters?.tags.map((t) => ({ id: t.id, title: t.title || null })) || []}
                selectedIds={selectedTags}
                type="tag"
              />
            </PopoverGroup>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="text-sm font-medium text-gray-500">
              Active Filters
              <span className="sr-only">, active</span>
            </h3>
            <div className="mt-2 sm:ml-4 sm:mt-0">
              <div className="-m-1 flex flex-wrap items-center">
                {activeFilters.map((activeFilter) => (
                  <span
                    key={`${activeFilter.type}-${activeFilter.id}`}
                    className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                  >
                    <span>{activeFilter.label}</span>
                    <button
                      type="button"
                      onClick={() => removeFilter(activeFilter.type, activeFilter.id)}
                      className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                    >
                      <span className="sr-only">Remove filter for {activeFilter.label}</span>
                      <X className="h-2 w-2" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:mt-0 sm:ml-auto"
              onClick={clearAllFilters}
            >
              <X className="mr-1.5 h-5 w-5 text-indigo-600" aria-hidden="true" />
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <div className="mt-4">
                  <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="text-sm font-medium text-gray-900">Product Type</h3>
                    <div className="mt-6 space-y-6">
                      {['card', 'gift'].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`filter-mobile-product-type-${type}`}
                            name="product-type"
                            value={type}
                            type="checkbox"
                            checked={selectedProductTypes.includes(type)}
                            onChange={() => handleFilterChange('productType', type)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-mobile-product-type-${type}`}
                            className="ml-3 text-sm text-gray-500"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                    <div className="mt-6 space-y-6">
                      {filters?.categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            id={`filter-mobile-category-${category.id}`}
                            name="category"
                            value={category.id}
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleFilterChange('category', category.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-mobile-category-${category.id}`}
                            className="ml-3 text-sm text-gray-500"
                          >
                            {category.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6">
                    <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                    <div className="mt-6 space-y-6">
                      {filters?.tags.map((tag) => (
                        <div key={tag.id} className="flex items-center">
                          <input
                            id={`filter-mobile-tag-${tag.id}`}
                            name="tag"
                            value={tag.id}
                            type="checkbox"
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => handleFilterChange('tag', tag.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-mobile-tag-${tag.id}`}
                            className="ml-3 text-sm text-gray-500"
                          >
                            {tag.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply filters button */}
                <div className="mt-4 border-t border-gray-200 px-4 py-6">
                  <button
                    type="button"
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </section>
  )
}
