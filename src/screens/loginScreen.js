/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StatusBar, TouchableOpacity, Alert} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import TopBlob from '../components/topBlob';

export default class LoginScreen extends React.Component {
  configureGoogleSign = () => {
    const {state} = this.props;
    const {google} = state;
    const {clientId} = google;

    GoogleSignin.configure({
      webClientId: clientId,
      offlineAccess: false,
    });
  };

  signIn = async () => {
    const {customSetState, state} = this.props;
    const {error, user} = state;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      customSetState({
        user: {...user, isLoggedIn: true, info: userInfo},
        error: {...error, user: null},
      });
    } catch (err) {
      // if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      //   Alert.alert('Process Cancelled');
      // } else if (err.code === statusCodes.IN_PROGRESS) {
      //   Alert.alert('Process in progress');
      // } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //   Alert.alert('Play services are not available');
      // } else {
      // Alert.alert('Something else went wrong... ', err.toString());
      customSetState({
        user: {...user, isLoggedIn: false, info: null},
        error: {...error, user: err},
      });
      // }
    }
  };

  getCurrentUserInfo = async () => {
    const {customSetState, state} = this.props;
    const {user, error} = state;
    try {
      const userInfo = await GoogleSignin.signInSilently();
      customSetState({
        user: {...user, isLoggedIn: true, info: userInfo},
        error: {...error, user: null},
      });
    } catch (err) {
      this.configureGoogleSign();
      if (err.code === statusCodes.SIGN_IN_REQUIRED) {
        Alert.alert('Please Sign in');
        customSetState({
          user: {...user, isLoggedIn: false, info: null},
          error: {...error, user: err},
        });
      } else {
        Alert.alert('Something else went wrong... ', err.toString());
        customSetState({
          user: {...user, isLoggedIn: false, info: null},
          error: {...error, user: err},
        });
      }
    }
  };

  componentDidMount() {
    this.getCurrentUserInfo();
  }

  render() {
    const {state} = this.props;
    const {assets, app} = state;
    const {blob2} = assets;
    const {name, desc} = app;

    return (
      <>
        <StatusBar barStyle="light-content" />
        <View style={{position: 'relative', flex: 1, overflow: 'hidden'}}>
          <TopBlob blob={blob2} />
          <View style={{flex: 1}} />
          <View
            style={{
              position: 'relative',
              zIndex: 10,
              padding: 20,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 48, fontWeight: 'bold', marginBottom: 20}}>
              {name}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'normal',
                marginBottom: 80,
                color: '#0000009a',
              }}>
              {desc}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#0099ff',
                padding: 5,
                width: '100%',
                alignItems: 'center',
                borderRadius: 5,
                paddingVertical: 10,
              }}
              onPress={this.signIn}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}
