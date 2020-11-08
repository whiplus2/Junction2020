import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

const GETLIST_API_ENDPOINT = 'https://ve6ngjcjpl.execute-api.ap-northeast-2.amazonaws.com/dev/user-places/'

export default class RecommendScreen extends React.Component {

  state = {
    // type -> 0: like, 1: superlike
    places: []
  } 

  constructor() {
    super()
  }

  componentWillMount() {
    this.getRecommendations()
  }

  getRecommendations = async () => {
    const userID = Constants.deviceId
    axios
      .get(GETLIST_API_ENDPOINT, { params: {userID:userID} })  // /dev/user-places/?userID=1234
      .then(results => {
        console.log("HTTP Request succeeded.");
        console.log(results);
        var newPlaces = []
        results.data.forEach(result => {
          const place = result.place
          var dictionary = {
            id: place.id,
            url: place.image_url,
            title: place.name,
            type: result.is_super_like ? 1 : 0,
            socket: place.sockets,
            wifi: place.wifi,
            latitude: place.latitude,
            longitude: place.longitude
          }
          newPlaces.push(dictionary)
        })
        this.setState({ places: newPlaces });
      })
      .catch(() => {
        Alert.alert("HTTP Request failed.")
      });
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.listItem}>
        <Image source={{uri: item.url}} style={styles.listImage}/>
        <Text style={styles.text}>{item.title}</Text>
        {item.type == 0 &&
          <Image source={require('../assets/like.png')} style={styles.typeIcon}/>
        }
        {item.type == 1 &&
          <Image source={require('../assets/superlike.png')} style={styles.typeIcon}/>
        }
        {item.socket == true &&
          <Image source={require('../assets/socket_true.png')} style={styles.socketIcon}/>
        }
        {item.socket == false &&
          <Image source={require('../assets/socket_false.png')} style={styles.socketIcon}/>
        }
        {item.wifi == true &&
          <Image source={require('../assets/wifi_true.png')} style={styles.wifiIcon}/>
        }
        {item.wifi == false &&
          <Image source={require('../assets/wifi_false.png')} style={styles.wifiIcon}/>
        }
      </TouchableOpacity>
    )
  }

  render() {
    const { places } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Your Picks</Text>   
        <FlatList
          style={styles.flatList}
          data={places}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity onPress={() => this.showMapScreen()}>
          <Image source={require('../assets/viewmap.png')}/>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  showMapScreen = (type) => {
    const { navigation } = this.props
    navigation.navigate('Map')
  }
}

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    height: screenHeight,
    width: screenWidth,
    padding: 16,
    marginBottom: 16,
  },
  listItem: {
    marginVertical: 10,
    backgroundColor: 'white'
  },
  listImage: {
    height: 132,
    backgroundColor: 'white'
  },
  text: {
    position: 'absolute',
    paddingTop: 40,
    paddingLeft: 16,
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  typeIcon: {
    height: 24,
    width: 24,
    position: 'absolute',
    marginTop: 102, 
    marginLeft: 16, 
  },
  socketIcon: {
    height: 22,
    width: 22,
    borderRadius: 11,
    position: 'absolute',
    marginTop: 102, 
    marginLeft: screenWidth-100,
    backgroundColor: 'white'
  },
  wifiIcon: {
    height: 22,
    width: 22,
    borderRadius: 11,
    position: 'absolute',
    marginTop: 102, 
    marginLeft: screenWidth-64,
    backgroundColor: 'white'
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
});