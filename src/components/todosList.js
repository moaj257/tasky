/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import TodoItem from './todoItem';

export default class TodosList extends React.Component {
  render() {
    const {states, toggleAction, handleEditTodos} = this.props;
    const {todos, todosLoading} = states;

    return (
      <View
        style={{
          position: 'relative',
          zIndex: 10,
        }}>
        {todos.length === 0 && todosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            Loading Todos...
          </Text>
        )}
        {todos.length === 0 && !todosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            No todos found.
          </Text>
        )}
        {todos &&
          todos.map((todo, i) => {
            return (
              <TodoItem
                key={`todo-${i}`}
                states={states}
                todo={todo}
                toggleAction={toggleAction}
                handleEditTodos={handleEditTodos}
              />
            );
          })}
      </View>
    );
  }
}
