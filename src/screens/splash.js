/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image} from 'react-native';

export default class Splash extends React.Component {
  render() {
    const {states} = this.props;
    const {assets, devInfo} = states;
    const {logo} = assets;
    const {width, height} = devInfo;

    return (
      <View
        style={{
          backgroundColor: '#ffaa00',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: width,
          height: height,
          zIndex: 100,
          top: 0,
          left: 0,
        }}>
        <Image
          source={logo}
          resizeMode={'cover'}
          style={{height: 180, width: 180}}
        />
      </View>
    );
  }
}
