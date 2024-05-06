import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import FuzzySearch from 'fuzzy-search'
import { Table, Avatar } from 'antd'
import { useLocation, Link } from 'react-router-dom/cjs/react-router-dom'
import { SearchBox } from '../components/SearchBox'
import { FilterDrawer } from '../components/FilterDrawer'
import reviewsList from '../../../../static/movie-reviews.json'

const defaulCurrentPage = 1
const defaultPageSize = 20
const pageSizeOptions = [20, 30, 40, 50]

const ReviewList = () => {
  const reviews = reviewsList
  const location = useLocation()

  const [page, setPage] = useState(defaulCurrentPage)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [query, setQuery] = useState('')
  const [ratingFilters, setRatingFilters] = useState([])
  const [dateFilters, setDateFilters] = useState([])
  const [pickFilters, setPickFilters] = useState([])
  const [open, setOpen] = useState(false)

  // Opens Filter Box Drawer
  const showDrawer = () => {
    setOpen(true)
  }
  // Closes Filter Box Drawer
  const onClose = () => {
    setOpen(false)
  }

  //Update state when current page and page size changes
  const onShowSizeChange = (current, pageSize) => {
    setPage(current)
    setPageSize(pageSize)
  }

  useEffect(() => {
    // Get search and filter values from query strings
    const params = new URLSearchParams(location.search)
    const queryString = params.get('query') || ''
    const qPage = params.get('page') || defaulCurrentPage
    const qPageSize = params.get('pageSize') || defaultPageSize
    const qRatingFilters = params.get('ratingFilters')
      ? params.get('ratingFilters').split(',')
      : []
    const qDateFilters = params.get('dateFilters')
      ? params.get('dateFilters').split(',')
      : []
    const qPickFilters = params.get('pickFilters')
      ? params.get('pickFilters').split(',')
      : []

    setQuery(queryString)
    setPage(Number(qPage))
    setPageSize(Number(qPageSize))
    setRatingFilters(qRatingFilters)
    setDateFilters(qDateFilters)
    setPickFilters(qPickFilters)
  }, [location.search])

  //Reviews
  const sortedReviews = reviews
    .sort((a, b) => a.publication_date - b.publication_date)
    .map(i => {
      const dataWithKey = { ...i, key: i.id }
      return dataWithKey
    })

  //recomputes the memoized reviewsShown when one of the dependencies has changed.
  const reviewsShown = useMemo(() => {
    //Filter reviews by mpaa_rating, publication_date, and critics_pick
    const filteredReviews = sortedReviews.filter(a => {
      const ratingMatch =
        !ratingFilters.length ||
        (ratingFilters.length && ratingFilters.includes(a.mpaa_rating))
      const adate = new Date(a.publication_date)
      const dateMatch =
        !dateFilters.length ||
        dateFilters.map(i => Number(i)).includes(adate.getFullYear())
      const pickMatch =
        !pickFilters.length ||
        pickFilters.map(i => Number(i)).includes(Number(a.critics_pick))

      return dateMatch && pickMatch && ratingMatch
    })

    //Search by display_title
    const searcher = new FuzzySearch(filteredReviews, ['display_title'], {
      caseSensitive: false,
    })
    const result = searcher.search(query)
    return result
  }, [query, ratingFilters, dateFilters, pickFilters])

  //Returns count of filters currently applied
  const filterCount = useMemo(() => {
    let count = 0
    if (ratingFilters.length) {
      count++
    }
    if (dateFilters.length) {
      count++
    }
    if (pickFilters.length) {
      count++
    }
    return count
  }, [ratingFilters, dateFilters, pickFilters])

  //Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'display_title',
      key: 'display_title',
      render: (_, record) => (
        <div className="items-center flex align-center">
          <Avatar
            size={40}
            shape="square"
            src={
              <img
                src={record.multimedia.src}
                className="rounded"
                alt={record.display_title}
              />
            }
          />

          <Link to={'/review/' + record.id} className="ml-4">
            {record.display_title}
          </Link>
        </div>
      ),
    },
    {
      title: 'Publication Date',
      dataIndex: 'publication_date',
      key: 'publication_date',
    },
    {
      title: 'MPAA Rating',
      dataIndex: 'mpaa_rating',
      key: 'mpaa_rating',
      render: text => <a>{text || 'Not Rated'}</a>,
    },
    {
      title: 'Critics pick',
      render: text => <a>{text ? 'Yes' : 'No'}</a>,
    },
  ]

  //Gets filter values from the filter box
  const getValues = (ratingsValue, dateValues, pickvalues) => {
    setRatingFilters(ratingsValue)
    setDateFilters(dateValues)
    setPickFilters(pickvalues)
  }

  const onChangePagination = (p, pS) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', p)
    url.searchParams.set('pageSize', pS)
    window.history.replaceState({}, '', url)
    setPage(p)
    setPageSize(pS)
  }

  return (
    <div>
      <div className="md:container md:mx-auto my-10">
        <div className=" ">
          <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div>
              <button
                type="button"
                onClick={showDrawer}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Filter
                <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                  {filterCount}
                </span>
              </button>
            </div>
            <SearchBox query={query} setQuery={setQuery} />
          </div>
          <Table
            pagination={{
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              total: reviewsShown.length,
              onShowSizeChange: onShowSizeChange,
              onChange: onChangePagination,
              pageSizeOptions: pageSizeOptions,
              pageSize: pageSize,
              current: page,
            }}
            columns={columns}
            dataSource={reviewsShown}
          />
        </div>
      </div>

      <FilterDrawer onClose={onClose} open={open} getValues={getValues} />
    </div>
  )
}
export default ReviewList
