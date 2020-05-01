import React from 'react';
import {
  Dimensions,
  AppState,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Q} from '@nozbe/watermelondb';
import {Notifications} from 'react-native-notifications';

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
import {getDistanceFromLatLonInKm, uuid} from './utils/functions';
import {withLocationPermissions} from './utils/withLocationPermissions';
import {database} from './database';

const {height, width} = Dimensions.get('window');

// const getLocation = async () => {
//   await GetLocation.getCurrentPosition({
//     enableHighAccuracy: true,
//     timeout: 15000,
//   })
//     .then(location => {
//       console.log(location, '__!!@@__LOC__');
//       let distance = getDistanceFromLatLonInKm(
//         location.latitude,
//         location.longitude,
//         11.8919026,
//         79.810501,
//       );
//       console.log(distance, '__DISTANCE__');
//     })
//     .catch(error => {
//       const {code, message} = error;
//       console.warn(code, message, '__!!@@__LOC__ERR__');
//     });
// };

class AppClass extends React.Component {
  timeInterval = null;
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
      place: null,
      lng: null,
      lat: null,
      placeId: null,
      is_active: true,
      is_complete: false,
    },
    isLoaded: false,
    todosLoading: false,
    completedTodosLoading: false,
    isEditing: false,
    appState: AppState.currentState,
    lat: null,
    lng: null,
    locations: [],
    isLocations: false,
  };

  customSetState = stateJSON => {
    this.setState(stateJSON);
  };

  getAllLocations = async () => {
    const {user} = this.state;
    const {info} = user;
    let locations = await database.collections
      .get('locations')
      .query(Q.where('userId', info.user.id))
      .fetch();

    console.log(locations, '_:LPCO');
    this.setState({locations});
  };

  loadTodos = async () => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user} = this.state;
    const {info} = user;
    let todos = [];
    let activeTodos = [];
    let completedTodos = [];

    todos = await database.collections
      .get('todos')
      .query(Q.where('is_active', true), Q.where('userId', info.user.id))
      .fetch();

    await todos.map(async todo => {
      if (todo.is_complete === true) {
        completedTodos = [
          {...todo.getTodo(), id: todo._raw.id},
          ...completedTodos,
        ];
      } else {
        activeTodos = [{...todo.getTodo(), id: todo._raw.id}, ...activeTodos];
      }
    });

    this.setState({todos: activeTodos, completedTodos: completedTodos}, () => {
      this.setState({todosLoading: false, completedTodosLoading: false});
    });
  };

  addTodos = async () => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user, currentTodo} = this.state;
    const {info} = user;
    await database.action(async () => {
      await database.collections.get('todos').create(todo => {
        todo.uuid = uuid();
        todo.title = currentTodo.title;
        todo.place = currentTodo.place;
        todo.is_complete = false;
        todo.is_active = true;
        todo.lat = currentTodo.lat;
        todo.lng = currentTodo.lng;
        todo.placeId = currentTodo.placeId;
        todo.userId = info.user.id;
        todo.created_at = new Date().getTime();
        todo.updated_at = new Date().getTime();
      });
    });
    await this.loadTodos();
    this.setState({
      todosLoading: false,
      completedTodosLoading: false,
      currentTodo: {
        id: null,
        title: null,
        place: null,
        lat: null,
        lng: null,
        placeId: null,
        is_active: true,
        is_complete: false,
      },
    });
  };

  updateTodos = async todoId => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    let {user, currentTodo} = this.state;
    const {info} = user;
    await database.action(async () => {
      let todosCollection = await database.collections.get('todos');
      let cTodo = await todosCollection.find(todoId);
      await cTodo.update(todo => {
        todo.title = currentTodo.title;
        todo.place = currentTodo.place;
        todo.is_complete = currentTodo.is_complete;
        todo.is_active = true;
        todo.lat = currentTodo.lat;
        todo.lng = currentTodo.lng;
        todo.placeId = currentTodo.placeId;
        todo.userId = info.user.id;
        todo.updated_at = new Date().getTime();
      });
    });
    await this.loadTodos();
    this.setState({
      todosLoading: false,
      completedTodosLoading: false,
      currentTodo: {
        id: null,
        title: null,
        place: null,
        lat: null,
        lng: null,
        placeId: null,
        is_active: true,
        is_complete: false,
      },
    });
  };

  deleteTodos = async todoId => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user, currentTodo} = this.state;
    const {info} = user;

    await database.action(async () => {
      let todosCollection = await database.collections.get('todos');
      let cTodo = await todosCollection.find(todoId);
      await cTodo.update(todo => {
        todo.title = currentTodo.title;
        todo.place = currentTodo.place;
        todo.is_complete = currentTodo.is_complete;
        todo.is_active = false;
        todo.lat = currentTodo.lat;
        todo.lng = currentTodo.lng;
        todo.placeId = currentTodo.placeId;
        todo.userId = info.user.id;
        todo.updated_at = new Date(currentTodo.created_at).getTime();
        todo.updated_at = new Date().getTime();
      });
    });

    await this.loadTodos();
    this.setState({
      todosLoading: false,
      completedTodosLoading: false,
      currentTodo: {
        id: null,
        title: null,
        place: null,
        lat: null,
        lng: null,
        placeId: null,
        is_active: true,
        is_complete: false,
      },
    });
  };

  addLocations = async cLocation => {
    const {user} = this.state;
    const {info} = user;
    let cLocationData = {
      ...cLocation,
      uuid: uuid(),
      userId: info.user.id,
      is_active: true,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };
    await database.action(async () => {
      await database.collections.get('locations').create(location => {
        location.uuid = cLocationData.uuid;
        location.lat = cLocationData.lat;
        location.lng = cLocationData.lng;
        location.userId = cLocationData.userId;
        location.is_active = cLocationData.is_active;
        location.created_at = cLocationData.created_at;
        location.updated_at = cLocationData.updated_at;
      });
    });
    this.setState({locations: [cLocationData, ...this.state.locations]});
    // this.getAllLocations();
    console.log('added location');
  };

  getPredictions = async q => {
    const client_id = 'IBDIYLRSISDOZ3M3MQZ4REKOM13VKPWIP0PMYI51Q0DX3PZX';
    const client_secret = 'WHKDE1VSLE2053ENPN0HY0OH0CVGHTL5G3B1LTIKSEM5IXND';
    return await fetch(
      `https://api.foursquare.com/v2/venues/search?query=${q}&near=Pondicherry,%20IN&limit=5&v=20200429&client_id=${client_id}&client_secret=${client_secret}`,
    )
      .then(res => res.json())
      .catch(err => err.json());
  };

  handleEditTodos = currentTodo => {
    this.setState({currentTodo: currentTodo});
  };

  onEnableLocationPress = async () => {
    const {locationPermissionGranted, requestLocationPermission} = this.props;
    if (!locationPermissionGranted) {
      const granted = await requestLocationPermission();
      if (granted) {
        return NativeModules.LocationManager.startBackgroundLocation();
      }
    }
    NativeModules.LocationManager.startBackgroundLocation();
  };

  onCancelLocationPress = () => {
    NativeModules.LocationManager.stopBackgroundLocation();
  };

  checkLocationUpdates = async nextState => {
    const {lat, lng, todos} = this.state;
    if (
      todos.length > 0 &&
      (lat !== nextState.latitude || lng !== nextState.longitude)
    ) {
      todos.map(async todo => {
        let distance = getDistanceFromLatLonInKm(
          nextState.latitude,
          nextState.longitude,
          todo.lat,
          todo.lng,
        );
        this.setState({lat: nextState.latitude, lng: nextState.longitude});
        if (distance <= 0.5) {
          Notifications.postLocalNotification({
            body: `${todo.title} at ${todo.place}`,
            title: 'Hey there!',
            silent: false,
            category: 'TASKY_LOCATION_NEAR_BY',
            payload: todo,
          });
          await this.addLocations({
            lat: this.state.lat,
            lng: this.state.lng,
          });
        }
      });
    }
  };

  componentDidMount() {
    SplashScreen.hide();
    this.subscription = DeviceEventEmitter.addListener(
      NativeModules.LocationManager.JS_LOCATION_EVENT_NAME,
      e => {
        this.checkLocationUpdates(e);
      },
    );
    this.onEnableLocationPress();
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    const {user, isLoaded} = this.state;

    if (user.isLoggedIn && isLoaded) {
      return (
        <DashScreen
          states={this.state}
          loadTodos={this.loadTodos}
          customSetState={this.customSetState}
          addTodos={this.addTodos}
          updateTodos={this.updateTodos}
          deleteTodos={this.deleteTodos}
          handleEditTodos={this.handleEditTodos}
          getPredictions={this.getPredictions}
          getAllLocations={this.getAllLocations}
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

const App = withLocationPermissions(AppClass);

export default App;
