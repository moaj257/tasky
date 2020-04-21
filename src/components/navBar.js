/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

export default class NavBar extends React.Component {
  render() {
    const {states, toggleAction} = this.props;
    const {assets} = states;
    const {close} = assets;

    return (
      <View
        style={{
          bottom: 5,
          right: 5,
          margin: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'transparent',
          position: 'absolute',
          zIndex: 50,
        }}>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: '#ffcc00',
            borderRadius: 15,
          }}
          onPress={() => toggleAction()}>
          <Image
            source={close}
            style={{
              borderRadius: 28,
              height: 18,
              width: 18,
              transform: [{rotate: '45deg'}],
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
