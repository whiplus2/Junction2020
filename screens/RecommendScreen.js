import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

export default class RecommendScreen extends React.Component {

  state = {
    dummyData: [
      {
        id: '0',
        image: './assets/restaurant/1.jpg',
        title: 'First Item',
      },
      {
        id: '1',
        image: './assets/restaurant/2.jpg',
        title: 'Second Item',
      },
      {
        id: '2',
        image: './assets/restaurant/3.jpg',
        title: 'Third Item',
      },
    ]
  } 

  constructor() {
    super()
  }

  componentWillMount() {
  }

  renderItem = ({ item }) => {
    <TouchableOpacity style={styles.listItem}>
      <View>
        <Image source={{uri: item.image}} />
      </View>
    </TouchableOpacity>
  }

  render() {
    const { dummyData } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={dummyData}
          keyExtractor={[item => item.id]}
          numColumns={2}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
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
    backgroundColor: 'red'
  },
  listItem: {
    width: screenWidth,
    height: 48,
    backgroundColor: 'white'
  }
});