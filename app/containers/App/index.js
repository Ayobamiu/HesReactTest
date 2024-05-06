/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react'
import { Helmet } from 'react-helmet' // Header Generator
import { Switch, Route } from 'react-router-dom'

import CriticsPage from './CriticsList/CriticsPage'
import ReviewPage from './ReviewList/ReviewPage'
import { NavBar } from './components/NavBar'
import HomePage from './HomePage/HomePage'

// import '../../styles/styles.scss'

export default function App(props) {
  return (
    <div className="app-wrapper">
      <Helmet defaultTitle="Everyone's a critic">
        <meta name="description" content="React Movie Reviews" />
      </Helmet>

      <NavBar />
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/home" component={HomePage} />
        <Route path="/critics" component={CriticsPage} />
        <Route path="/review/:id" component={ReviewPage} />
      </Switch>
    </div>
  )
}
