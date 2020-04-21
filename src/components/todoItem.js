/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

export default class TodoItem extends React.Component {
  render() {
    const {todo, toggleAction, handleEditTodos} = this.props;
    // const {todos} = states;
    return (
      <TouchableOpacity
        style={{
          borderColor: '#00000009',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
        onPress={() => {
          toggleAction();
          handleEditTodos(todo);
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 24,
            marginBottom: 10,
          }}>
          {todo.title}
        </Text>
        <Text style={{fontSize: 16, color: '#0000009a'}}>London</Text>
      </TouchableOpacity>
    );
  }
}
