/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Dimensions} from 'react-native';

import Animated, {Easing} from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
} = Animated;

const {height} = Dimensions.get('window');

const runTiming = (clock, value, dest) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position,
  ]);
};

export default class DashScreen extends React.Component {
  constructor() {
    super();
    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0)),
            ),
          ]),
      },
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3, 0],
      extrapolate: Extrapolate.CLAMP,
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffa0fe'}}>
        <View style={{flex: 1}} />
        <View style={{height: height / 3, justifyContent: 'center'}}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                backgroundColor: 'white',
                height: 70,
                marginHorizontal: 20,
                borderRadius: 35,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 5,
                opacity: this.buttonOpacity,
                transform: [{translateY: this.buttonY}],
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              height: 70,
              marginHorizontal: 20,
              borderRadius: 35,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 5,
              backgroundColor: '#2E71DC',
              opacity: this.buttonOpacity,
              transform: [{translateY: this.buttonY}],
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
              SIGN IN WITH FACEBOOK
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }
}
