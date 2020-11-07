import React from 'react'
import { StyleSheet} from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Home from './screens/HomeScreen'
import Swipe from './screens/SwipeScreen'
import Recommend from './screens/RecommendScreen'
import Map from './screens/MapScreen'

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Swipe: { screen: Swipe },
    Recommend: { screen: Recommend},
    Map: { screen: Map },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    headerMode: "none",
  }
)

export default class App extends React.Component {

  render() {
    const Layout = createAppContainer(AppNavigator)

    return (
      <Layout />
    )
  }
}

const styles = StyleSheet.create({})