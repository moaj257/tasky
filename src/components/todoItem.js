/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Text, Image, View} from 'react-native';

export default class TodoItem extends React.Component {
  render() {
    const {
      todo,
      toggleAction,
      handleEditTodos,
      customSetState,
      states,
      isActive,
    } = this.props;
    const {assets} = states;
    const {tick, cancel, pin} = assets;
    // const {todos} = states;
    return (
      <TouchableOpacity
        style={{
          borderColor: '#00000029',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
          position: 'relative',
          zIndex: 50,
          overflow: 'hidden',
        }}
        onPress={() => {
          handleEditTodos(todo);
          customSetState({isEditing: true});
          toggleAction();
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 24,
            marginBottom: 10,
          }}
          numberOfLines={1}>
          {todo.title}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={pin} style={{height: 18, width: 18}} />
          <Text
            style={{fontSize: 16, color: '#0000009a', marginLeft: 5, flex: 1}}
            numberOfLines={1}>
            {todo.location}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            opacity: isActive ? 0.05 : 0.15,
          }}>
          <Image
            source={todo.isComplete ? tick : cancel}
            style={{height: 96, width: 96}}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
