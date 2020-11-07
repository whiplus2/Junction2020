import React from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity, Image} from 'react-native';
import * as Location from 'expo-location';

const SCREEN_WIDTH = Dimensions.get('window').width

export default class HomeScreen extends React.Component {

  state = {
    location: null
  }

  constructor() {
    super()
  }
  componentWillMount() {
    this.requestLocation()
  }

  requestLocation = async () => {
    let { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
    }
    let location = await Location.getCurrentPositionAsync({})
    this.setState({ location: location })
  }

  showSwipeScreen = (type) => {
    const { navigation } = this.props
    navigation.navigate('Swipe', {Swipe: {type: type}})
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>Hey! What do you feel{"\n"}like doing today?</Text>
        </View>
        <TouchableOpacity onPress={() => this.showSwipeScreen('eat')}>
          <Image style={styles.button} source={require('../assets/group1.png')}>
          </Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.showSwipeScreen('drink')}>
          <Image style={styles.button} source={require('../assets/group2.png')}>
          </Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.showSwipeScreen('work')}>
          <Image style={styles.button} source={require('../assets/group3.png')}>
          </Image>
        </TouchableOpacity>
      </View>
    );
  }
}
const screenWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    height: 160,
    width: screenWidth*0.9,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: '500',
  }
});