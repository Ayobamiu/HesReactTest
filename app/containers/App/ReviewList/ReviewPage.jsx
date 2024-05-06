import React, { useEffect } from 'react'
import { compose } from 'redux'
import { Badge, Empty } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { getMovieReviews } from '../../../resources/reviews/reviews.actions'

const ReviewPage = props => {
  const { id } = props.match.params
  const history = useHistory()

  useEffect(() => {
    if (!props.reviews.length) {
      props.getMovieReviews()
    }
  }, [history])

  const review = props.reviews.find(i => i.id === Number(id))

  if (!review) return <Empty />
  return (
    <div className="flex justify-center p-4">
      <Helmet>
        <meta name="description" content={review.display_title} />
      </Helmet>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <img
          className="rounded-t-lg w-full"
          src={review && review.multimedia ? review.multimedia.src : ''}
          alt={review ? review.display_title : ''}
        />

        <div className="p-5">
          {review.critics_pick === 1 && (
            <Badge
              color="green"
              text={review.critics_pick ? "Critic's Pick" : ''}
              size="small"
            />
          )}
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {review.display_title}{' '}
            <small className=" font-normal text-xs">
              <small className="uppercase ">{review.mpaa_rating}</small>
            </small>
          </h5>

          <p className="subpixel-antialiased font-bold text-xs mb-3">
            {review.headline}
          </p>

          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">
            {review.summary_short}
          </p>
          <p className="text-xs mb-3">By {review.byline}</p>
          <a
            href={review.link.url}
            title={review.link.suggested_link_text}
            target="_blank"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    reviews: state.resources.reviews.data,
  }
}

const mapDispatchToProps = dispatch => ({
  getMovieReviews: () => dispatch(getMovieReviews()),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ReviewPage)
