import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity} from 'react-native';

export default class RecommendScreen extends React.Component {

  constructor() {
    super()
  }

  componentWillMount() {
  }

  showMapScreen = () => {
    const { navigation } = this.props
    navigation.navigate('Map')
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{height: 60, width: 120, backgroundColor: "red"}} onPress={() => this.showMapScreen()}>

        </TouchableOpacity>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#550088',
    alignItems: 'center',
    justifyContent: 'center',
  },
});