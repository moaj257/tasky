import React from 'react';
import {Dimensions, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';

import LoginScreen from './screens/loginScreen';
import DashScreen from './screens/dashScreen';
import Splash from './screens/splash';

import Blob1 from './assets/images/blob1.png';
import Blob2 from './assets/images/blob2.png';
import Plus from './assets/images/plus.png';
import Pin from './assets/images/pin.png';
import Text from './assets/images/text.png';
import Close from './assets/images/close.png';
import Cancel from './assets/images/cancel.png';
import Tick from './assets/images/tick.png';
import Logo from './assets/images/logo.png';

import {WEB_CLIENT_ID} from './utils/keys';
import {Todos} from './utils/todos';

const {height, width} = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    assets: {
      blob1: Blob1,
      blob2: Blob2,
      plus: Plus,
      pin: Pin,
      text: Text,
      close: Close,
      cancel: Cancel,
      tick: Tick,
      logo: Logo,
    },
    devInfo: {
      height: height,
      width: width,
    },
    google: {
      clientId: WEB_CLIENT_ID,
    },
    app: {
      name: 'Tasky',
      desc:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    user: {
      isLoggedIn: false,
      info: null,
    },
    error: {
      user: null,
    },
    todos: [],
    completedTodos: [],
    currentTodo: {
      id: null,
      title: null,
      location: null,
      latitude: null,
      longitude: null,
      placeId: null,
      isActive: true,
      isComplete: false,
    },
    isLoaded: false,
    todosLoading: false,
    completedTodosLoading: false,
    isEditing: false,
  };

  customSetState = stateJSON => {
    this.setState(stateJSON);
  };

  completeTodos = async () => {
    this.setState({completedTodosLoading: true});
    const {user} = this.state;
    const {info} = user;
    const refs = Todos();
    let completedTodos = [];
    if (refs) {
      await refs
        .where('userId', '==', info.user.id)
        .where('isActive', '==', true)
        .where('isComplete', '==', true)
        .orderBy('createdAt', 'asc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            completedTodos = [{...doc.data()}, ...completedTodos];
          });
        });
    }

    this.setState({completedTodos}, () => {
      this.setState({completedTodosLoading: false});
    });
  };

  loadTodos = async () => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user} = this.state;
    const {info} = user;
    const refs = Todos();
    let todos = [];
    if (refs) {
      await refs
        .where('userId', '==', info.user.id)
        .where('isActive', '==', true)
        .where('isComplete', '==', false)
        .orderBy('createdAt', 'asc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            todos = [{...doc.data()}, ...todos];
          });
        });
    }

    this.setState({todos}, () => {
      this.setState({todosLoading: false});
    });
  };

  generateNewKey = () => {
    const _ref = Todos().doc();
    const newKey = _ref.id;
    return newKey;
  };

  addTodos = async () => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user, currentTodo} = this.state;
    const {info} = user;
    const refs = Todos();
    await refs
      .add({
        ...currentTodo,
        userId: info.user.id,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(async refData => {
        await refs.doc(refData.id).update({
          ...currentTodo,
          id: refData.id,
        });
        await this.loadTodos();
        await this.completeTodos();
        this.setState({
          todosLoading: false,
          completedTodosLoading: false,
          currentTodo: {
            id: null,
            title: null,
            location: null,
            latitude: null,
            longitude: null,
            placeId: null,
            isActive: true,
            isComplete: false,
          },
        });
      });
  };

  updateTodos = async todoId => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user, currentTodo} = this.state;
    const {info} = user;
    const refs = Todos();
    console.log(todoId);
    await refs
      .doc(todoId)
      .update({
        ...currentTodo,
        userId: info.user.id,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(async () => {
        await this.loadTodos();
        await this.completeTodos();

        this.setState({
          todosLoading: false,
          completedTodosLoading: false,
          currentTodo: {
            id: null,
            title: null,
            location: null,
            latitude: null,
            longitude: null,
            placeId: null,
            isActive: true,
            isComplete: false,
          },
        });
      });
  };

  deleteTodos = async todoId => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user, currentTodo} = this.state;
    const {info} = user;
    const refs = Todos();
    await refs
      .doc(todoId)
      .update({
        ...currentTodo,
        userId: info.user.id,
        isActive: false,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(async () => {
        await this.loadTodos();
        await this.completeTodos();
        this.setState({
          todosLoading: false,
          completedTodosLoading: false,
          currentTodo: {
            id: null,
            title: null,
            location: null,
            latitude: null,
            longitude: null,
            placeId: null,
            isActive: true,
            isComplete: false,
          },
        });
      });
  };

  handleEditTodos = currentTodo => {
    this.setState({currentTodo});
  };

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const {user, isLoaded} = this.state;
    
    console.log(user.isLoggedIn, isLoaded, '__LOADED');

    if (user.isLoggedIn && isLoaded) {
      return (
        <DashScreen
          states={this.state}
          loadTodos={this.loadTodos}
          completeTodos={this.completeTodos}
          customSetState={this.customSetState}
          addTodos={this.addTodos}
          updateTodos={this.updateTodos}
          deleteTodos={this.deleteTodos}
          handleEditTodos={this.handleEditTodos}
        />
      );
    }

    return (
      <>
        {!isLoaded && <Splash states={this.state} />}
        {!user.isLoggedIn && (
          <LoginScreen
            states={this.state}
            customSetState={this.customSetState}
          />
        )}
      </>
    );
  }
}
