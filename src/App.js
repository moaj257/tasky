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
import moment from 'moment';

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
import Calendar from './assets/images/calendar.png';
import Cake from './assets/images/cake-pop.png';
import Clock from './assets/images/clock.png';
import CurrentLoc from './assets/images/explorer.png';
import Back from './assets/images/back.png';

import {WEB_CLIENT_ID} from './utils/keys';
import {getDistanceFromLatLonInKm, uuid} from './utils/functions';
import {withLocationPermissions} from './utils/withLocationPermissions';
import {database} from './database';

const {height, width} = Dimensions.get('window');

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
      calendar: Calendar,
      cake: Cake,
      clock: Clock,
      currentLoc: CurrentLoc,
      back: Back,
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
    birthdaytodos: [],
    completedTodos: [],
    currentTodo: {
      id: null,
      title: null,
      location: null,
      place: null,
      lng: null,
      lat: null,
      is_birthday: false,
      is_notified: false,
      reminder_date_time_at: null,
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
    this.setState({locations});
  };

  loadTodos = async () => {
    this.setState({todosLoading: true, completedTodosLoading: true});
    const {user} = this.state;
    const {info} = user;
    let todos = [];
    let activeTodos = [];
    let completedTodos = [];
    let birthdaytodos = [];

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
        if(todo.is_birthday)
          birthdaytodos = [{...todo.getTodo(), id: todo._raw.id}, ...birthdaytodos];
        activeTodos = [{...todo.getTodo(), id: todo._raw.id}, ...activeTodos];
      }
    });

    this.setState({todos: activeTodos, completedTodos: completedTodos, birthdaytodos: birthdaytodos}, () => {
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
        todo.is_birthday = currentTodo.is_birthday;
        todo.is_notified = false;
        todo.reminder_date_time_at = currentTodo.reminder_date_time_at;
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
        is_birthday: false,
        reminder_date_time_at: null,
        placeId: null,
        is_active: true,
        is_complete: false,
      },
    });
  };

  updateTodos = async (todoId, is_notified) => {
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
        todo.is_notified = is_notified === 1 ? true : false;
        todo.is_birthday = currentTodo.is_birthday;
        todo.reminder_date_time_at = currentTodo.reminder_date_time_at;
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
        is_birthday: false,
        reminder_date_time_at: null,
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
        todo.is_notified = currentTodo.is_notified;
        todo.is_birthday = currentTodo.is_birthday;
        todo.reminder_date_time_at = currentTodo.reminder_date_time_at;
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
        is_birthday: false,
        is_notified: false,
        reminder_date_time_at: null,
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
  };

  getPredictions = async q => {
    const client_id = 'IBDIYLRSISDOZ3M3MQZ4REKOM13VKPWIP0PMYI51Q0DX3PZX';
    const client_secret = 'WHKDE1VSLE2053ENPN0HY0OH0CVGHTL5G3B1LTIKSEM5IXND';
    return await fetch(
      `https://api.foursquare.com/v2/venues/search?query=${q}&near=Pondicherry,%20IN&limit=5&v=20200429&client_id=${client_id}&client_secret=${client_secret}`,
    )
      .then(async res => {
        let resp = res.json();
        return resp;
      })
      .catch(err =>  console.log(err));
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

  checkNotifications = async nextState => {
    const {lat, lng, todos, birthdaytodos} = this.state;
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
        if (distance <= 0.5 && !todo.is_notified && !todo.is_birthday) {
          this.setState({currentTodo: todo}, () => this.updateTodos(todo.id, 1));
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
        } else if(!todo.is_birthday) {
          this.setState({currentTodo: todo}, () => this.updateTodos(todo.id, 0));
        }
      });
    }
    
    if (birthdaytodos.length > 0){
      birthdaytodos.map(birthdaytodo => {
        let beginningTime = moment(birthdaytodo.reminder_date_time_at);
        let endTime1 = moment().subtract(2, 'minutes');
        let endTime2 = moment().add(2, 'minutes');
        if(beginningTime.isBetween(endTime1,endTime2) && !birthdaytodo.is_notified){
          Notifications.postLocalNotification({
            body: `${birthdaytodo.title.toLowerCase().indexOf('wish') === -1 ? 'Wish ' : ''}${birthdaytodo.title} now`, //at ${beginningTime.format('DD/MM/YYY hh:mm A')
            title: 'Hey there!',
            silent: false,
            category: 'TASKY_BIRTHDAY',
            payload: birthdaytodo,
          });
          this.setState({currentTodo: {...birthdaytodo, is_complete: true}}, () => this.updateTodos(birthdaytodo.id, 1));
        }
      });
    }
  };
  
  addPlaces = async (placeData) => {
    await database.action(async () => {
      await database.collections.get('places').create(place => {
        place.uuid = uuid();
        place.name = placeData.name;
        place.lat = placeData.lat;
        place.lng = placeData.lng;
        place.is_active = true;
        place.created_at = new Date().getTime();
        place.updated_at = new Date().getTime();
      });
    });
  }

  componentDidMount() {
    SplashScreen.hide();
    this.subscription = DeviceEventEmitter.addListener(
      NativeModules.LocationManager.JS_LOCATION_EVENT_NAME,
      e => {
        this.checkNotifications(e);
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
          addPlaces={this.addPlaces}
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
