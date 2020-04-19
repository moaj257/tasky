/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import TopBlob from '../components/topBlob';

export default class DashScreen extends React.Component {
  componentDidMount() {
    const {loadTodos} = this.props;
    loadTodos();
  }

  render() {
    const {state} = this.props;
    const {assets, user, todos, devInfo} = state;
    const {blob2} = assets;
    const {width} = devInfo;
    const {info} = user;

    return (
      <View style={{flex: 1}}>
        <TopBlob blob={blob2} />
        <View
          style={{
            width: width,
            position: 'relative',
            zIndex: 50,
            paddingHorizontal: 20,
            paddingTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          <TouchableOpacity style={{position: 'relative', zIndex: 50}}>
            <View
              style={{
                height: 6,
                width: 35,
                backgroundColor: '#000',
                borderRadius: 20,
                marginBottom: 6,
              }}
            />
            <View
              style={{
                height: 6,
                width: 25,
                backgroundColor: '#000',
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'relative', zIndex: 50}}>
            <Image
              source={{uri: info.user.photo}}
              style={{height: 48, width: 48, borderRadius: 28}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{padding: 20, paddingTop: 68, flex: 1}}>
            <View
              style={{
                position: 'relative',
                zIndex: 10,
              }}>
              <Text
                style={{fontSize: 32, fontWeight: 'bold', marginVertical: 10}}>
                Welcome {info.user.givenName}
              </Text>
              <Text style={{fontSize: 20, color: '#0000009a'}}>
                You have 5 todos pending.
              </Text>
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
            <View
              style={{
                position: 'relative',
                zIndex: 10,
              }}>
              {todos &&
                todos.map((todo, i) => {
                  return (
                    <TouchableOpacity
                      key={`todo-${i}`}
                      style={{
                        borderColor: '#00000009',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginBottom: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 24,
                          marginBottom: 10,
                        }}>
                        {todo.title}
                      </Text>
                      <Text style={{fontSize: 18, color: '#0000009a'}}>
                        London
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
