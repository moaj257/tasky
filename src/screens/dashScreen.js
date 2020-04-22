/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import TopBlob from '../components/topBlob';
import TodosModal from '../components/todosModal';
import NavBar from '../components/navBar';
import TodosList from '../components/todosList';

const {Value} = Animated;
const {height, width} = Dimensions.get('window');

export default class DashScreen extends React.Component {
  state = {fade: true, active: true};

  componentDidMount() {
    const {loadTodos, completeTodos} = this.props;
    loadTodos();
    completeTodos();
  }

  buttonOpacity = new Value(0);

  activeOpacity = new Value(0);

  buttonY = this.buttonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [height - 200, 0],
  });

  activeX = this.activeOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width + (width - 110)],
  });

  activeTodosY = this.activeOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  completeTodosY = this.activeOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  toggleAction = () => {
    this.setState({fade: !this.state.fade}, () => {
      Animated.timing(this.buttonOpacity, {
        toValue: !this.state.fade ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  activeAction = () => {
    this.setState({active: true});
    Animated.timing(this.activeOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  completeAction = () => {
    this.setState({active: false});
    Animated.timing(this.activeOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
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
    const {assets, user, todos, completedTodos} = states;
    const {blob2} = assets;
    const {info} = user;
    const {active} = this.state;

    return (
      <View style={{flex: 1}}>
        <TopBlob blob={blob2} />
        <ScrollView>
          <View style={{padding: 20, flex: 1}}>
            <View
              style={{
                position: 'relative',
                zIndex: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    marginVertical: 10,
                    textTransform: 'capitalize',
                  }}>
                  {(active
                  ? todos.length > 0
                  : completedTodos.length > 0)
                    ? 'Hi '
                    : 'Welcome '}
                  {info.user.givenName}
                </Text>
                <Text style={{fontSize: 20, color: '#0000009a'}}>
                  {todos.length === 0
                    ? 'Click (+) and add todos.'
                    : `You have ${
                        active ? todos.length : completedTodos.length
                      } ${active ? 'active' : 'completed'} todos.`}
                </Text>
              </View>
              <Image
                source={{uri: info.user.photo}}
                style={{height: 56, width: 56, borderRadius: 28}}
              />
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
              <Animated.View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  zIndex: 10,
                  transform: [{translateX: this.activeX}],
                }}>
                <TouchableOpacity onPress={() => this.activeAction()}>
                  <Text
                    style={{
                      fontSize: 56,
                      color: this.state.active ? '#000000' : '#0000007a',
                      fontWeight: 'bold',
                    }}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.completeAction()}>
                  <Text
                    style={{
                      fontSize: 56,
                      color: !this.state.active ? '#000000' : '#0000007a',
                      fontWeight: 'bold',
                      marginLeft: 25,
                    }}>
                    Complete
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <Animated.View
              style={{
                position: 'relative',
                zIndex: 100,
                flexDirection: 'row',
                transform: [
                  {
                    translateY: active
                      ? this.completeTodosY
                      : this.activeTodosY,
                  },
                ],
              }}>
              {active ? (
                <TodosList
                  states={states}
                  isActive={true}
                  customSetState={customSetState}
                  toggleAction={this.toggleAction}
                  handleEditTodos={handleEditTodos}
                />
              ) : (
                <TodosList
                  states={states}
                  isActive={false}
                  customSetState={customSetState}
                  toggleAction={this.toggleAction}
                  handleEditTodos={handleEditTodos}
                />
              )}
            </Animated.View>
          </View>
        </ScrollView>
        <NavBar
          states={states}
          toggleAction={this.toggleAction}
          customSetState={customSetState}
        />
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
