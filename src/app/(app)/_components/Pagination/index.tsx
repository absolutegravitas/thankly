'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

const Pagination = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  if (totalPages <= 1) return null //don't display UI at all if there is only one page

  const searchParams = useSearchParams()

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `/shop?${params.toString()}`
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="flex justify-center items-center space-x-4">
      {currentPage > 1 && (
        <Link href={createPageUrl(currentPage - 1)} passHref>
          <Button variant="outline" className="text-thankly-green">
            &lt; Previous Page
          </Button>
        </Link>
      )}
      <ul className="inline-flex space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <Link href={createPageUrl(number)} passHref>
              <Button
                variant={number === currentPage ? 'default' : 'outline'}
                className={`px-4 py-2 ${
                  number === currentPage ? 'bg-thankly-green text-white' : 'text-thankly-green'
                }`}
              >
                {number}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
      {currentPage < totalPages && (
        <Link href={createPageUrl(currentPage + 1)} passHref>
          <Button variant="outline" className="text-thankly-green">
            Next Page &gt;
          </Button>
        </Link>
      )}
    </nav>
  )
}

export default Pagination
