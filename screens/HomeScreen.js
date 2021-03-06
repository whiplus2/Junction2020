import React from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
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
      <SafeAreaView style={styles.whole}>
        <ScrollView>
          <View style={styles.container}>
          <View style={{height:48}}></View>
            <View>
              <Text style={styles.headerText}>Hey! What do you feel{"\n"}like doing today?</Text>
            </View>
            <TouchableOpacity onPress={() => this.showSwipeScreen('')}>
              <Image style={styles.button} source={require('../assets/group1.png')}>
              </Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showSwipeScreen('Bar')}>
              <Image style={styles.button} source={require('../assets/group2.png')}>
              </Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showSwipeScreen('Cafeteria')}>
              <Image style={styles.button} source={require('../assets/group3.png')}>
              </Image>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const screenWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  whole: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f4f1e7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f1e7',
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
    borderRadius: 12,
  },
  text: {
    fontSize: 32,
    fontWeight: '500',
  }
});