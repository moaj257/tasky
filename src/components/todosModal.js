/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Image, Text, TextInput} from 'react-native';

export default class TodosModal extends React.Component {
  render() {
    const {states, toggleAction} = this.props;
    const {assets} = states;
    const {pin, text, close} = assets;

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#fff',
              flex: 1,
            }}>
            Add Todo
          </Text>
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: '#ffcc00',
              borderRadius: 30,
            }}
            onPress={() => toggleAction()}>
            <Image source={close} style={{height: 16, width: 16}} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#fff',
          }}>
          Title
        </Text>
        <View
          style={{
            marginBottom: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Image
            source={text}
            style={{marginHorizontal: 5, width: 28, height: 28}}
          />
          <TextInput
            placeholder="Green Peas"
            placeholderTextColor="#ffcc0040"
            style={{
              flex: 1,
              fontSize: 18,
              color: '#ffcc00',
              paddingHorizontal: 5,
              paddingLeft: 0,
              paddingVertical: 10,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#fff',
          }}>
          Location
        </Text>
        <View
          style={{
            marginBottom: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Image source={pin} style={{marginHorizontal: 5}} />
          <TextInput
            placeholder="Market"
            placeholderTextColor="#ffcc0040"
            style={{
              flex: 1,
              fontSize: 18,
              color: '#ffcc00',
              paddingHorizontal: 5,
              paddingLeft: 0,
              paddingVertical: 10,
            }}
          />
        </View>
        <View style={{marginBottom: 15}}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
            }}>
            Complete
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffcc00',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#000',
                width: 80,
                textAlign: 'center',
              }}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffcc00',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#000',
                width: 80,
                textAlign: 'center',
              }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
