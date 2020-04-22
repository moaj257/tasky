/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import TodoItem from './todoItem';

export default class TodosList extends React.Component {
  render() {
    const {
      states,
      isActive,
      toggleAction,
      handleEditTodos,
      customSetState,
    } = this.props;
    const {
      todos,
      completedTodos,
      completedTodosLoading,
      todosLoading,
      devInfo,
    } = states;
    const {width} = devInfo;

    return (
      <View
        style={{
          width: width - 40,
        }}>
        {isActive && todos.length === 0 && todosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            Loading todos...
          </Text>
        )}
        {isActive && todos.length === 0 && !todosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            No todos found.
          </Text>
        )}

        {!isActive && completedTodos.length === 0 && completedTodosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            Loading completed todos...
          </Text>
        )}
        {!isActive && completedTodos.length === 0 && !completedTodosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            No completed todos found.
          </Text>
        )}

        {isActive &&
          todos &&
          todos.map((todo, i) => {
            return (
              <TodoItem
                key={`todo-${i}`}
                states={states}
                todo={todo}
                isActive={isActive}
                toggleAction={toggleAction}
                handleEditTodos={handleEditTodos}
                customSetState={customSetState}
              />
            );
          })}

        {!isActive &&
          completedTodos &&
          completedTodos.map((completedTodo, i) => {
            return (
              <TodoItem
                key={`todo-${i}`}
                states={states}
                todo={completedTodo}
                isActive={isActive}
                toggleAction={toggleAction}
                handleEditTodos={handleEditTodos}
                customSetState={customSetState}
              />
            );
          })}
      </View>
    );
  }
}
