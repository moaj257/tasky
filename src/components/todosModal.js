/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import CheckBox from '@react-native-community/checkbox';

const {width} = Dimensions.get('window');

export default class TodosModal extends React.Component {
  state = {
    predictions: [],
    showPredictions: false,
    isLocationEditable: true,
    mapError: null,
  };

  placeFinder = q => {
    if (q.length < 2) {
      return;
    }
    RNGooglePlaces.getAutocompletePredictions(
      q,
      {
        type: 'geocode',
        country: 'IN',
      },
      ['placeID', 'location', 'name', 'address'],
    )
      .then(results => this.setState({predictions: results}))
      .catch(error => Alert.alert(error.toString()));
  };

  placeUpdate = async prediction => {
    const {states, customSetState, toggleAction} = this.props;
    const {currentTodo} = states;
    const {placeID, primaryText} = prediction;
    customSetState({
      currentTodo: {...currentTodo, placeId: placeID, location: primaryText},
    });
    this.setState({
      showPredictions: false,
      isLocationEditable: false,
      isSaveDisabled: true,
    });
    await RNGooglePlaces.lookUpPlaceByID(placeID, ['location'])
      .then(({location}) => {
        customSetState({
          currentTodo: {
            ...this.props.states.currentTodo,
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
      })
      .catch(error => {
        console.log(error.message, 'ERR');
        Alert.alert(error.message.toString());
      });
    this.setState({isSaveDisabled: false, isLocationEditable: true});
  };

  render() {
    const {predictions, showPredictions, isLocationEditable} = this.state;
    const {
      states,
      toggleAction,
      customSetState,
      addTodos,
      updateTodos,
      deleteTodos,
    } = this.props;
    const {assets, currentTodo, isEditing} = states;
    const {pin, text, close} = assets;

    let isSaveDisabled = true;
    if (
      currentTodo.title !== null &&
      currentTodo.title.length > 0 &&
      currentTodo.location !== null &&
      currentTodo.location.length > 0 &&
      currentTodo.latitude !== null &&
      currentTodo.longitude !== null &&
      currentTodo.placeID !== null
    ) {
      if (isEditing) {
        if (currentTodo.id !== null) {
          isSaveDisabled = false;
        } else {
          isSaveDisabled = true;
        }
      } else {
        isSaveDisabled = false;
      }
    }

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#fff',
              flex: 1,
            }}>
            {isEditing ? 'Update' : 'Add'} Todo
          </Text>
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: '#ffcc00',
              borderRadius: 30,
            }}
            onPress={() => toggleAction()}>
            <Image source={close} style={{height: 16, width: 16}} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#fff',
          }}>
          Title
        </Text>
        <View
          style={{
            marginBottom: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Image
            source={text}
            style={{marginHorizontal: 5, width: 28, height: 28}}
          />
          <TextInput
            placeholder="Green Peas"
            placeholderTextColor="#ffcc0040"
            style={{
              flex: 1,
              fontSize: 18,
              color: '#ffcc00',
              paddingHorizontal: 5,
              paddingLeft: 0,
              paddingVertical: 10,
            }}
            value={currentTodo.title}
            onChangeText={txt =>
              customSetState({currentTodo: {...currentTodo, title: txt}})
            }
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#fff',
          }}>
          Location
        </Text>
        <View
          style={{
            marginBottom: !isEditing ? 15 : 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Image source={pin} style={{marginHorizontal: 5}} />
          <TextInput
            placeholder="Market"
            placeholderTextColor="#ffcc0040"
            style={{
              flex: 1,
              fontSize: 18,
              color: '#ffcc00',
              paddingHorizontal: 5,
              paddingLeft: 0,
              paddingVertical: 10,
            }}
            value={currentTodo.location}
            onChangeText={txt => {
              customSetState({currentTodo: {...currentTodo, location: txt}});
              this.placeFinder(txt);
            }}
            onFocus={() => this.setState({showPredictions: true})}
            onBlur={() => this.setState({showPredictions: false})}
            editable={isLocationEditable}
          />
        </View>

        {showPredictions && predictions.length > 0 && (
          <View
            style={{
              position: 'relative',
              top: 0,
              left: 0,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            {predictions.map((prediction, i) => (
              <TouchableOpacity
                key={`prediction-${i}`}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  width: width - 40,
                }}
                onPress={() => this.placeUpdate(prediction)}>
                <Text
                  style={{color: '#000', fontWeight: 'bold', fontSize: 18}}
                  numberOfLines={1}>
                  {prediction.primaryText}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {isEditing && (
          <View
            style={{
              marginBottom: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Complete
            </Text>
            <CheckBox
              onChange={() =>
                customSetState({
                  currentTodo: {
                    ...this.props.states.currentTodo,
                    isComplete: !this.props.states.currentTodo.isComplete,
                  },
                })
              }
              style={{marginTop: 10, marginLeft: 5}}
              value={currentTodo.isComplete}
              tintColors={{true: '#ffcc00', false: '#fff'}}
            />
          </View>
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              backgroundColor: isSaveDisabled ? '#ffcc0040' : '#ffcc00',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 5,
            }}
            onPress={() => {
              !isEditing ? addTodos(currentTodo) : updateTodos(currentTodo.id);
              toggleAction();
            }}
            disabled={isSaveDisabled}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#000',
                width: isEditing ? 80 : width - 60,
                textAlign: 'center',
              }}>
              {!isEditing ? 'Save' : 'Update'}
            </Text>
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity
              style={{
                backgroundColor: '#ffcc00',
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 5,
              }}
              onPress={() => {
                deleteTodos(currentTodo.id);
                toggleAction();
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#000',
                  width: 80,
                  textAlign: 'center',
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
