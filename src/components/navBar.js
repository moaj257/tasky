/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

export default class NavBar extends React.Component {
  render() {
    const {states, toggleAction, customSetState} = this.props;
    const {assets} = states;
    const {close, pin} = assets;

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
            backgroundColor: '#000',
            borderRadius: 15,
            marginRight: 15,
          }}
          onPress={() => {
            customSetState({
              isLocations: true,
              isEditing: false,
              currentTodo: {
                id: null,
                title: null,
                place: null,
                lat: null,
                lng: null,
                placeId: null,
                is_active: true,
                is_complete: false,
              },
            });
            toggleAction();
          }}>
          <Image
            source={pin}
            style={{
              borderRadius: 28,
              height: 18,
              width: 18,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: '#ffcc00',
            borderRadius: 15,
          }}
          onPress={() => {
            customSetState({
              isEditing: false,
              currentTodo: {
                id: null,
                title: null,
                place: null,
                lat: null,
                lng: null,
                placeId: null,
                is_active: true,
                is_complete: false,
              },
            });
            toggleAction();
          }}>
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
