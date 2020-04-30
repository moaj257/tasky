/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import TodoItem from './todoItem';

export default class TodosList extends React.Component {
  render() {
    const {
      states,
      is_active,
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
        {is_active && todosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            Loading todos...
          </Text>
        )}
        {is_active && todos.length === 0 && !todosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            No todos found.
          </Text>
        )}

        {!is_active && completedTodosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            Loading completed todos...
          </Text>
        )}
        {!is_active && completedTodos.length === 0 && !completedTodosLoading && (
          <Text style={{fontSize: 18, color: '#00000085'}}>
            No completed todos found.
          </Text>
        )}

        {!todosLoading &&
          is_active &&
          todos &&
          todos.map((todo, i) => {
            return (
              <TodoItem
                key={`todo-${i}`}
                states={states}
                todo={todo}
                is_active={is_active}
                toggleAction={toggleAction}
                handleEditTodos={handleEditTodos}
                customSetState={customSetState}
              />
            );
          })}

        {!completedTodosLoading &&
          !is_active &&
          completedTodos &&
          completedTodos.map((completedTodo, i) => {
            return (
              <TodoItem
                key={`todo-${i}`}
                states={states}
                todo={completedTodo}
                is_active={is_active}
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
