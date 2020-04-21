/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, ScrollView, Animated, Dimensions} from 'react-native';
import TopBlob from '../components/topBlob';
import TodosModal from '../components/todosModal';
import NavBar from '../components/navBar';
import TodosList from '../components/todosList';

const {Value} = Animated;
const {height, width} = Dimensions.get('window');

export default class DashScreen extends React.Component {
  state = {fade: true, menuVisible: true};

  componentDidMount() {
    const {loadTodos} = this.props;
    loadTodos();
  }

  buttonOpacity = new Value(0);

  buttonY = this.buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [height - 200, 0],
  });

  toggleAction = () => {
    this.setState({fade: !this.state.fade}, () => {
      Animated.timing(this.buttonOpacity, {
        toValue: !this.state.fade ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  render() {
    const {
      states,
      customSetState,
      addTodos,
      updateTodos,
      deleteTodos,
      handleEditTodos,
    } = this.props;
    const {assets, user, todos} = states;
    const {blob2} = assets;
    const {info} = user;

    return (
      <View style={{flex: 1}}>
        <TopBlob blob={blob2} />
        <ScrollView>
          <View style={{padding: 20, flex: 1}}>
            <View
              style={{
                position: 'relative',
                zIndex: 10,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    marginVertical: 10,
                  }}>
                  Welcome {info.user.givenName}
                </Text>
                <Text style={{fontSize: 20, color: '#0000009a'}}>
                  {todos.length === 0
                    ? 'Click (+) and add todos.'
                    : `You have ${todos.length} todos pending.`}
                </Text>
              </View>
            </View>
            <View
              style={{
                position: 'relative',
                zIndex: 10,
                marginTop: 40,
                marginBottom: 20,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 96,
                  position: 'absolute',
                  top: -55,
                  left: -18,
                  zIndex: 0,
                  color: '#ffcc0090',
                }}>
                TODOS
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 96,
                  position: 'absolute',
                  top: -55,
                  left: -18,
                  zIndex: 10,
                  color: '#ffffff40',
                }}>
                TODOS
              </Text>
              <Text
                style={{
                  position: 'relative',
                  zIndex: 10,
                  fontSize: 56,
                  color: '#000000',
                  fontWeight: 'bold',
                }}>
                Active
              </Text>
              <Text
                style={{
                  position: 'relative',
                  zIndex: 10,
                  fontSize: 56,
                  color: '#0000007a',
                  fontWeight: 'bold',
                  marginLeft: 25,
                }}>
                Complete
              </Text>
            </View>
            <TodosList
              states={states}
              toggleAction={this.toggleAction}
              handleEditTodos={handleEditTodos}
            />
          </View>
        </ScrollView>
        <NavBar states={states} toggleAction={this.toggleAction} />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: -5,
            left: 0,
            zIndex: 20,
            width: width,
            height: height - 200,
            backgroundColor: '#000000f0',
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            paddingHorizontal: 20,
            paddingVertical: 15,
            marginVertical: 5,
            transform: [{translateY: this.buttonY}],
          }}>
          <TodosModal
            states={states}
            toggleAction={this.toggleAction}
            customSetState={customSetState}
            addTodos={addTodos}
            updateTodos={updateTodos}
            deleteTodos={deleteTodos}
          />
        </Animated.View>
      </View>
    );
  }
}