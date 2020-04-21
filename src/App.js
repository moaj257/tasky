import React from 'react';
import {Dimensions} from 'react-native';

import LoginScreen from './screens/loginScreen';
import DashScreen from './screens/dashScreen';

import Blob1 from './assets/images/blob1.png';
import Blob2 from './assets/images/blob2.png';
import Plus from './assets/images/plus.png';
import Pin from './assets/images/pin.png';
import Text from './assets/images/text.png';
import Close from './assets/images/close.png';
import Cancel from './assets/images/cancel.png';
import Tick from './assets/images/tick.png';

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
  };

  customSetState = stateJSON => {
    this.setState(stateJSON);
  };

  loadTodos = async () => {
    const {user} = this.state;
    const {info} = user;
    const refs = Todos();
    const todos = [];
    await refs
      .where('userId', '==', info.user.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          todos.push({...doc.data()});
        });
      });

    this.setState({todos});
  };

  render() {
    const {user} = this.state;

    return !user.isLoggedIn ? (
      <LoginScreen states={this.state} customSetState={this.customSetState} />
    ) : (
      <DashScreen states={this.state} loadTodos={this.loadTodos} />
    );
  }
}
