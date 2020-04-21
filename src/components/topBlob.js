/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import Pulse from 'react-native-pulse';

const {width} = Dimensions.get('window');

export default class TopBlob extends React.Component {
  render() {
    const {blob} = this.props;
    return (
      <View
        style={{
          position: 'absolute',
          top: -200,
          left: -200,
          opacity: 0.75,
          zIndex: 10,
        }}>
        <Image source={blob} resizeMode={'contain'} />
        <Pulse
          color="orange"
          numPulses={3}
          diameter={width}
          speed={10}
          duration={2000}
          style={{position: 'absolute', left: -200, top: 0}}
        />
      </View>
    );
  }
}
