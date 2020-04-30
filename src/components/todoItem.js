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
      // is_active,
    } = this.props;
    const {assets} = states;
    const {blob2, blob1, pin} = assets;
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
            {todo.place}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -35,
            left: -40,
            opacity: 0.5,
            zIndex: -1,
          }}>
          <Image
            source={todo.is_complete ? blob1 : blob2}
            style={{height: 128, width: 128}}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
