import React, { useEffect } from 'react'
import { useState } from 'react'
import reviewsList from '../../../../static/movie-reviews.json'
import { Checkbox } from 'antd'
import { Drawer } from 'antd'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'

export function FilterDrawer({ onClose, open, getValues }) {
  //List of ratings from the data
  const MPAARatings = new Set(
    reviewsList.map(i => i.mpaa_rating || 'Not Rated')
  )
  //List of dates from the data
  const PubDates = new Set(
    reviewsList.map(i => {
      const date = new Date(i.publication_date)
      return date.getFullYear()
    })
  )
  const [ratingFilters, setRatingFilters] = useState([])
  const [dateFilters, setDateFilters] = useState([])
  const [pickFilters, setPickFilters] = useState([])
  const location = useLocation()

  useEffect(() => {
    // Get filter values from query strings

    const params = new URLSearchParams(location.search)

    const qratingFilters = params.get('ratingFilters')
      ? params.get('ratingFilters').split(',')
      : []
    const qdateFilters = params.get('dateFilters')
      ? params.get('dateFilters').split(',')
      : []
    const qpickFilters = params.get('pickFilters')
      ? params.get('pickFilters').split(',')
      : []

    setRatingFilters(qratingFilters)
    setDateFilters(qdateFilters.map(i => Number(i)))
    setPickFilters(qpickFilters.map(i => Number(i)))
  }, [location.search])

  const onChangeMPPA = checkedValues => {
    setRatingFilters(checkedValues)
  }
  const onChangePubDate = checkedValues => {
    setDateFilters(checkedValues)
  }
  const onChangeCriticPick = checkedValues => {
    setPickFilters(checkedValues)
  }

  const applyFilter = () => {
    const url = new URL(window.location.href)
    if (ratingFilters.length) {
      url.searchParams.set('ratingFilters', ratingFilters.toString())
    } else {
      url.searchParams.delete('ratingFilters')
    }
    if (dateFilters.length) {
      url.searchParams.set('dateFilters', dateFilters.toString())
    } else {
      url.searchParams.delete('dateFilters')
    }
    if (pickFilters.length) {
      url.searchParams.set('pickFilters', pickFilters.toString())
    } else {
      url.searchParams.delete('pickFilters')
    }
    getValues(ratingFilters, dateFilters, pickFilters)

    window.history.replaceState({}, '', url)
    onClose()
  }

  const resetFilter = () => {
    setRatingFilters([])
    setDateFilters([])
    setPickFilters([])
    const url = new URL(window.location.href)
    url.searchParams.delete('ratingFilters')
    url.searchParams.delete('dateFilters')
    url.searchParams.delete('pickFilters')
    getValues([], [], [])
    window.history.replaceState({}, '', url)
    onClose()
  }

  return (
    <Drawer title="Filters" onClose={onClose} open={open}>
      <div className="">
        <div className="font-medium text-sm text-gray-900 dark:text-white">
          MPAA Rating
        </div>
        <br />
        <Checkbox.Group
          options={Array.from(MPAARatings) || []}
          value={ratingFilters}
          onChange={onChangeMPPA}
        />
        <div className="mt-3 mb-3 font-medium text-sm text-gray-900 dark:text-white">
          Publication date
        </div>
        <Checkbox.Group
          options={Array.from(PubDates) || []}
          value={dateFilters}
          onChange={onChangePubDate}
        />
        <div className="font-medium my-3 text-sm text-gray-900 dark:text-white">
          Critic's pick
        </div>
        <Checkbox.Group
          options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
          value={pickFilters}
          onChange={onChangeCriticPick}
        />{' '}
        <div className=" my-3 inline-flex rounded-md " role="group">
          <button
            onClick={resetFilter}
            type="button"
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
            Reset Filter
          </button>

          <button
            onClick={applyFilter}
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
            Apply filter
          </button>
        </div>
      </div>
    </Drawer>
  )
}
