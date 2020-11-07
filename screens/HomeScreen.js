import React from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width

export default class HomeScreen extends React.Component {

  constructor() {
    super()
  }

  componentWillMount() {
  }

  showSwipeScreen = (type) => {
    const { navigation } = this.props
    navigation.navigate('Swipe', {Swipe: {type: type}})
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{ height: 60 }}></View>

        <TouchableOpacity onPress={() => this.showSwipeScreen('eat')}>
            <View style={{height: 80, width: SCREEN_WIDTH, backgroundColor: 'yellow'}}>
                <Text>Eat</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.showSwipeScreen('drink')}>
            <View style={{height: 80, width: SCREEN_WIDTH, backgroundColor: 'red'}}>
                <Text>Drink</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.showSwipeScreen('work')}>
            <View style={{height: 80, width: SCREEN_WIDTH, backgroundColor: 'blue'}}>
                <Text>Work</Text>
            </View>
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
});