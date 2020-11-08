import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
export default class MapScreen extends React.Component {

  constructor() {
    super()
  }

  componentWillMount() {
  }

  render() {
    return (
      <View style={styles.container}>   
        <Text style={styles.text}>Your Picks</Text>   
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: 35.681236,
            longitude: 139.767125,
            latitudeDelta: 0.02, //小さくなるほどズーム
            longitudeDelta: 0.02,
          }}>
          <MapView.Marker
            coordinate={{
              latitude: 35.681236,
              longitude: 139.767125,
            }}
            title={"東京駅"}
            description={"JRの駅です。"}
            onPress={()=>alert("click")}
          />
        </MapView>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.button} >
          <Image source={require('../assets/back_button.png')}>
          </Image>
        </TouchableOpacity> 
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
    mapStyle: {
      height: screenHeight-240,
      width: screenWidth,
      marginTop: 16,
      marginBottom: 120,
    },
    text: {
      fontSize: 24,
      fontWeight: '600',
      width: screenWidth-80,
      textAlign: 'center',
      marginHorizontal: 40,
      marginTop: 64,
      height: 40,
    },
    button: {
      height: 56,
      width: screenWidth,
      marginTop: screenHeight-96,
      marginHorizontal: 32,
      position:'absolute',
    },
  });