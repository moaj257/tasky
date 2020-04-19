/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image} from 'react-native';

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
      </View>
    );
  }
}
