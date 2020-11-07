import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity} from 'react-native';

export default class RecommendScreen extends React.Component {

  constructor() {
    super()
  }

  componentWillMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>RecommendScreen</Text>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});