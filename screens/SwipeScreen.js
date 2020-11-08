import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ActivityIndicator, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Constants from 'expo-constants';

import axios from 'axios';

const GETLIST_API_ENDPOINT = 'https://ve6ngjcjpl.execute-api.ap-northeast-2.amazonaws.com/dev/places/'
const POSTLIKE_API_ENDPOINT = 'https://ve6ngjcjpl.execute-api.ap-northeast-2.amazonaws.com/dev/user-places/like/'
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
export default class SwipeScreen extends React.Component {
  constructor() {
    super()
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      cards: [],
      likeList: [], // array of placeID ex) ["2103", "4170", "4141"]
      superLikeList: [] // array of placeID ex) ["4141"]
    }
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })
    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })
  }
  componentWillMount() {
    this.getCards()
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(gestureState.dy)
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.sendLikePlace(0)
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.cards.length <= this.state.currentIndex) {
      this.showRecommendScreen()
    }
  }
  showRecommendScreen = () => {
    const { navigation } = this.props
    navigation.navigate('Recommend')
  }

  getCards = async () => {
    const type = this.props.navigation.state.params.Swipe.type
    axios
      .get(GETLIST_API_ENDPOINT, { params: {limit:10, offset:0} })
      .then(results => {
        console.log("HTTP Request succeeded.");
        var newPlaces = []
        results.data.results.forEach(place => {
          var dictionary = {
            id: place.id,
            aitoID: place.aito_id,
            latitude: place.latitude,
            longitude: place.longitude,
            name: place.name,
            address: place.address,
            city: place.city,
            state: place.state,
            country: place.country,
            fax: place.fax,
            zip: place.zip,
            alcohol: place.alcohol,
            smokingArea: place.smoking_area,
            dressCode: place.dress_code,
            accessibility: place.accessibility,
            price: place.price,
            url: place.url,
            rambience: place.Rambience,
            franchise: place.franchise,
            area: place.area,
            otherServices: place.other_services,
            wifi: place.wifi,
            sockets: place.sockets,
            workspace: place.workspace,
            imageURL: place.image_url,
            distance: place.distance,
            congestion: place.congestion
          }
          newPlaces.push(dictionary)
        })
        this.setState({ cards: newPlaces });
      })
      .catch(() => {
        Alert.alert("HTTP Request failed.")
        const { navigation } = this.props
        navigation.goBack()
      });
  }

  sendLikePlace = (isSuperLike) => {
    const { currentIndex, cards } = this.state
    const placeID = cards[currentIndex].id
    const userID = Constants.deviceId
    axios
      .get(POSTLIKE_API_ENDPOINT, { params: {isSuperLike:isSuperLike, placeID:placeID, userID:userID} }) ///dev/user-places/like/?isSuperLike=1&placeID=161&userID=1234
      .then(results => {
        console.log("HTTP Request succeeded.");
      })
      .catch(() => {
        Alert.alert("HTTP Request failed.")
      });
  }

  tapLikeButton = () => {
    const { currentIndex, cards, likeList } = this.state
    likeList.push(cards[currentIndex].id)
    this.sendLikePlace(0)
    this.setState({likeList: likeList})
    Animated.spring(this.position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 }
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }

  tapDislikeButton = () => {
    Animated.spring(this.position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 }
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }

  tapSuperlikeButton = () => {
    const { currentIndex, cards, likeList, superLikeList } = this.state
    likeList.push(cards[currentIndex].id)
    superLikeList.push(cards[currentIndex].id)
    this.sendLikePlace(1)
    this.setState({likeList: likeList})
    this.setState({superLikeList: superLikeList})
    Animated.spring(this.position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 }
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }

  renderCards = () => {

    const { cards } = this.state
    return this.state.cards.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[ this.rotateAndTranslate, styles.swipeScreen ]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 160, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </Animated.View>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 160, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
            </Animated.View>
            <View style={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}>
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover'}}
                source={{uri:item.imageURL}}
              />
              <View style={styles.desctiprion}>
                <Text style={styles.text}>{cards[i].name}</Text>
                <Image source={require('../assets/socket_true.png')} style={styles.socketIcon}/>
                <Image source={require('../assets/wifi_true.png')} style={styles.wifiIcon}/>
              </View>
            </View> 
          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View
            key={item.id} 
            style={[ styles.swipeScreen, { opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }],}]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </Animated.View>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
            </Animated.View>
            <View style={{ flex: 1, height: null, width: null, resizeMode: 'cover'}}>
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover'}}
                source={{uri:item.imageURL}}
              />
              <View style={styles.desctiprion}>
                <Text style={styles.text}>{cards[i].name}</Text>
                <Image source={require('../assets/socket_true.png')} style={styles.socketIcon}/>
                <Image source={require('../assets/wifi_true.png')} style={styles.wifiIcon}/>
              </View>
            </View> 
          </Animated.View>
        )
      }
    }).reverse()
  }
  render() {
    return (
      <View style={[ styles.container, { flex: 1 }]}>
        <View style={{ height: 60 }}>
        </View>
        <View style={{ flex: 1}}>
          {this.state.cards.length <= 0 ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
            ) : (
              this.renderCards()
            )}      
        </View>
        <View style={styles.buttonSection}>
          <TouchableOpacity onPress={() => this.tapDislikeButton()}>
              <Image style={styles.button} source={require('../assets/dislike.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.tapSuperlikeButton()}>
            <Image style={styles.button} source={require('../assets/superlike.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.tapLikeButton()}>
            <Image style={styles.button} source={require('../assets/like.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.menuButton} source={require('../assets/menu.png')}></Image>
          </TouchableOpacity>
        </View>
        <View style={{ height: 60 }}>
        </View>
      </View>
    );
  }
}
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f1e7',
  },
  swipeScreen: {
    height: screenHeight*0.7,
    width: screenWidth,
    paddingHorizontal: 16,
    paddingTop: screenHeight*0.15,
    position: 'absolute',
  },
  desctiprion: {
    width: screenWidth-64,
    height: 100,
    position: 'absolute',
    marginLeft: 16,
    marginTop: screenHeight*0.4,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  buttonSection: {
    marginRight: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  button: {
    height: 64,
    width: 64,
    borderRadius: 32,
    marginHorizontal: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 16,
    marginLeft: 16,
  },
  menuButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 10,
  },
  socketIcon: {
    height: 22,
    width: 22,
    borderRadius: 11,
    position: 'absolute',
    marginTop: 64, 
    marginLeft: screenWidth-140,
    backgroundColor: 'white'
  },
  wifiIcon: {
    height: 22,
    width: 22,
    borderRadius: 11,
    position: 'absolute',
    marginTop: 64, 
    marginLeft: screenWidth-100,
    backgroundColor: 'white'
  }
});