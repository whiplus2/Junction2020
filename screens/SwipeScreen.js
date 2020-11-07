import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ActivityIndicator, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import axios from 'axios';

const API_ENDPOINT = 'http://192.168.1.8:8080/invoice.js'
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
export default class SwipeScreen extends React.Component {
  constructor() {
    super()
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      cards: [
        { id: "1", uri: require('../assets/restaurants/1.jpg') },
        { id: "2", uri: require('../assets/restaurants/2.jpg') },
        { id: "3", uri: require('../assets/restaurants/3.jpg') }
      ],
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
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
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
      .get(API_ENDPOINT, { params: {} })
      .then(results => {
        console.log("HTTP Request succeeded.");
        console.log(results);
        this.setState({ cards: results });
      })
      .catch(() => {
        Alert.alert("HTTP Request failed.")
        // const { navigation } = this.props
        // navigation.goBack()
      });
  }

  tapLikeButton = () => {
    const { currentIndex, cards, likeList } = this.state
    likeList.push(cards[currentIndex].id)
    this.setState({likeList: likeList})

    // TODO: - Misaki カードを右にスワイプさせて、currentIndexを１つ更新する
  }

  tapDislikeButton = () => {

    // TODO: - Misaki カードを左にスワイプさせて、currentIndexを１つ更新する
  }

  tapSuperlikeButton = () => {
    const { currentIndex, cards, likeList, superLikeList } = this.state
    likeList.push(cards[currentIndex].id)
    superLikeList.push(cards[currentIndex].id)
    this.setState({likeList: likeList})
    this.setState({superLikeList: superLikeList})

    // TODO: - Misaki カードを右にスワイプさせて、currentIndexを１つ更新する
  }

  renderCards = () => {

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
                source={item.uri} 
              />
              <View style={styles.desctiprion}>
                <Text>The Name</Text>
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
                source={item.uri} 
              />
              <View style={styles.desctiprion}>
                <Text>The Name</Text>
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
          <TouchableOpacity>
            <Image style={styles.button} source={require('../assets/like.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.button} source={require('../assets/superlike.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.button} source={require('../assets/dislike.png')}></Image>
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
    width: screenWidth-60,
    height: 120,
    position: 'absolute',
    marginHorizontal: 20,
    marginTop: screenHeight*0.5,
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
  menuButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 10,
  }
});