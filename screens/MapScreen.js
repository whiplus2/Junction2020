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
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image style={styles.button} source={require('../assets/back.png')}>
          </Image>
        </TouchableOpacity> 
      </View>

    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    button: {
      top: 36,
      left: 16,
      height: 56,
      width: 56,
      position:'absolute',
      zIndex: 200,
    },
  });