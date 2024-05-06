import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet' // Header Generator
import { compose } from 'redux'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getMovieReviews } from 'resources/reviews/reviews.actions'
import ReviewList from '../ReviewList/ReviewList'

export function HomePage(props) {
  const history = useHistory()
  useEffect(() => {
    props.getMovieReviews()
  }, [history, props.reviews.length])

  return (
    <div>
      <Helmet>
        <meta name="description" content="Home" />
      </Helmet>

      <ReviewList />
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
)(HomePage)
