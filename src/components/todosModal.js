/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Keyboard,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from '@react-native-community/geolocation';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Q} from '@nozbe/watermelondb';
import {database} from '../database';

export default class TodosModal extends React.Component {
  state = {
    predictions: [],
    showPredictions: false,
    showPopup: false,
    isLocationEditable: true,
    mapError: null,
    mode: null,
    lat: null,
    lng: null,
    place: null,
    showModel: false,
    sdate: new Date(),
  };

  placeFinder = async (func, q) => {
    if (q.length <= 3) {
      return;
    }
    this.setState({showPredictions: true});

    let predictions = await func(q);
    let placesArr = [];
    let places = await database.collections
      .get('places')
      .query(Q.where('is_active', true), Q.where('name', Q.like(`%${q}%`)))
      .fetch();
    places.map(place => {
      let pdata = place.getPlace();
      let { created_at, updated_at, ...pfdata } = pdata;
      placesArr = [...placesArr, {...pfdata, location: {lat: pfdata.lat, lng: pfdata.lng}}];
    });
    if (predictions && predictions.response && predictions.response.venues) {
      this.setState({predictions: [...placesArr, ...predictions.response.venues]});
    } else {
      Alert.alert(predictions.toString());
    }
  };

  placeUpdate = async prediction => {
    const {states, customSetState} = this.props;
    const {currentTodo} = states;
    const {id, name, location} = prediction;
    const {lat, lng} = location;
    customSetState({
      currentTodo: {
        ...currentTodo,
        placeId: id,
        place: name,
        lat: lat.toString(),
        lng: lng.toString(),
      },
    });
    this.setState({
      showPredictions: false,
      isLocationEditable: true,
      isSaveDisabled: false,
    });
  };

  onChangeTime = (selectedData) => {
    const currentData = moment(selectedData);
    this.setState({sdate: currentData});
  }

  onClickOk = () => {
    const {customSetState, states} = this.props;
    const {currentTodo} = states;
    const {sdate} = this.state;
    this.setState({
      showModel: false
    }, () => {
      let reminder_date = moment(`${moment(sdate).format('DD/MM/YYYY hh:mm A')}`, 'DD/MM/YYYY hh:mm A');
      customSetState({currentTodo: {...currentTodo, reminder_date_time_at: new Date(reminder_date)}});
    });
  }

  onClickCancel = () => {
    this.setState({ showModel: false, sdate: new Date() });
  }

  handlePopUp = () => {
    const {showPopup} = this.state;
    Geolocation.getCurrentPosition(
       (position) => {
          const lat = JSON.stringify(position.coords.longitude);
          const lng = JSON.stringify(position.coords.latitude);
          this.setState({ showPopup: !showPopup, lat, lng });
       },
       (error) => alert(error.message),
       {timeout: 20000}
    );
  }

  handleAddLocation = () => {
    const {customSetState, states, addPlaces} = this.props;
    const {place, showPopup, lat, lng} = this.state;
    const {currentTodo} = states;
    addPlaces({name: place, lat: lat, lng: lng});
    customSetState({currentTodo: {...currentTodo, place: place, lat: lat, lng: lng}});
    this.setState({ showPopup: !showPopup });
  }

  render() {
    const {predictions, showPredictions, isLocationEditable, sdate, showModel, showPopup, lat, lng, place} = this.state;
    const {
      states,
      toggleAction,
      customSetState,
      addTodos,
      updateTodos,
      deleteTodos,
      getPredictions,
    } = this.props;
    const {assets, currentTodo, isEditing, isLocations, locations, devInfo} = states;
    const {pin, calendar, text, close, blob1, currentLoc, back} = assets;
    const {width, height} = devInfo;

    if (isLocations) {
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
              Locations
            </Text>
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: '#ffcc00',
                borderRadius: 30,
              }}
              onPress={() => {
                customSetState({isLocations: false});
                toggleAction();
              }}>
              <Image source={close} style={{height: 16, width: 16}} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{marginTop: 5}}>
            {locations && locations.length === 0 && (
              <Text style={{color: '#fff'}}>No Locations available</Text>
            )}
            {locations &&
              locations.length > 0 &&
              locations.map((location, i) => (
                <View
                  key={`location-${i}`}
                  style={{
                    backgroundColor: '#ffffff20',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: locations.length - 1 === i ? 55 : 10,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: 2,
                    }}>
                    <Text style={{color: '#fff'}}>Latitude</Text>
                    <Text style={{color: '#fff'}}>{location.lat}</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: 2,
                    }}>
                    <Text style={{color: '#fff'}}>Longitude</Text>
                    <Text style={{color: '#fff'}}>{location.lng}</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: 2,
                    }}>
                    <Text style={{color: '#fff'}}>Date</Text>
                    <Text style={{color: '#fff'}}>
                      {`${new Date(
                        location.created_at,
                      ).toLocaleDateString()} ${new Date(
                        location.created_at,
                      ).toLocaleTimeString()}`}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      );
    }

    let isSaveDisabled = true;
    let isAddDisabled = true;
    if(place !== null && place.length > 0 && lat !== null && lng !== null){
      isAddDisabled = false;
    }
    if (
      currentTodo.title !== undefined &&
      currentTodo.title !== null &&
      currentTodo.title.length > 0
    ) {
      if(currentTodo.is_birthday && sdate !== undefined && sdate !== null){
        if (isEditing) {
          if (currentTodo.id !== null) {
            isSaveDisabled = false;
          } else {
            isSaveDisabled = true;
          }
        } else {
          isSaveDisabled = false;
        }
      }else if(
        currentTodo.place !== undefined &&
        currentTodo.place !== null &&
        currentTodo.place.length > 0 &&
        currentTodo.lat !== undefined &&
        currentTodo.lat !== null &&
        currentTodo.lng !== undefined &&
        currentTodo.lng !== null &&
        currentTodo.placeId !== undefined &&
        currentTodo.placeId !== null){
          if (isEditing) {
            if (currentTodo.id !== null) {
              isSaveDisabled = false;
            } else {
              isSaveDisabled = true;
            }
          } else {
            isSaveDisabled = false;
          }
      }else{
        isSaveDisabled = false;
      }
    }

    return (
      <React.Fragment>
        <React.Fragment>
          <View style={{position: 'relative'}}>
            <Image
              source={blob1}
              style={{
                height: 128,
                width: 128,
                position: 'absolute',
                top: 0,
                right: 0,
                opacity: 0.5,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: 'bold',
                    marginBottom: 0,
                    color: '#fff',
                  }}>
                  {showPopup ? `Add Location` : `${isEditing ? 'Update' : 'Add'} Todo`}
                </Text>
                {!showPopup &&
                (<View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#ffffff75',
                    }}>
                    Birthday Reminder
                  </Text>
                  <Switch
                    trackColor={{ false: "#ffffff75", true: "#b36b00" }}
                    thumbColor={"#ff9900"}
                    onValueChange={ () => customSetState({currentTodo: {...currentTodo, is_birthday: !currentTodo.is_birthday}}) }
                    value={currentTodo.is_birthday}
                  />
                </View>)}
              </View>
              {!showPopup ? (<TouchableOpacity
                style={{
                  padding: 15,
                  backgroundColor: '#ffcc00',
                  borderRadius: 30,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  toggleAction();
                }}>
                <Image source={close} style={{height: 16, width: 16}} />
              </TouchableOpacity>) : (<TouchableOpacity
                style={{
                  padding: 15,
                  backgroundColor: '#ffcc00',
                  borderRadius: 30,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  this.handlePopUp();
                }}>
                <Image source={back} style={{height: 16, width: 16}} />
              </TouchableOpacity>)}
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 5,
                color: '#fff',
              }}>
              {!showPopup ? `${currentTodo.is_birthday ? `Name` : `Title`}` : `Name`}
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
                placeholder={!showPopup ? `${currentTodo.is_birthday ? `John Doe` : `Green Peas`}` : 'Home'}
                placeholderTextColor="#ffcc0040"
                style={{
                  flex: 1,
                  fontSize: 18,
                  color: '#ffcc00',
                  paddingHorizontal: 5,
                  paddingLeft: 0,
                  paddingVertical: 10,
                }}
                value={!showPopup ? currentTodo.title : place}
                onChangeText={txt =>
                  !showPopup ? customSetState({currentTodo: {...currentTodo, title: txt}}) : this.setState({place: txt})
                }
              />
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              {showPopup && (<View style={{flex: 1}}>
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
                      placeholder="13.145, -76.543"
                      placeholderTextColor="#ffcc0040"
                      value={`${lat}, ${lng}`}
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        paddingRight: 10,
                        color: '#ffcc00',
                      }}
                      editable={false} />
                </View>
              </View>)}
              {!showPopup && (<View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 5,
                    color: '#fff',
                  }}>
                  {currentTodo.is_birthday ? `Date & Time` : `Location`}
                </Text>
                <View
                  style={{
                    marginBottom: !isEditing ? 15 : 0,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <Image source={currentTodo.is_birthday ? calendar : pin} style={{marginHorizontal: 5}} />
                  {currentTodo.is_birthday ? 
                    (<TouchableOpacity onPress={() => this.setState({showModel: true})}>
                      <TextInput
                      placeholder="21/03/2020 1:31 AM"
                      placeholderTextColor="#ffcc0040"
                      value={currentTodo.reminder_date_time_at && moment(currentTodo.reminder_date_time_at).format('DD/MM/YYYY hh:mm A')}
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        paddingRight: 10,
                        color: '#ffcc00',
                      }}
                      editable={false} />
                    </TouchableOpacity>) : 
                    (<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <TextInput
                        placeholder="Market"
                        placeholderTextColor="#ffcc0040"
                        style={{
                          width: !isEditing ? width - 135 : width - 100,
                          marginRight: 10,
                          fontSize: 18,
                          color: '#ffcc00',
                          paddingHorizontal: 5,
                          paddingLeft: 0,
                          paddingVertical: 10,
                        }}
                        value={currentTodo.place}
                        onChangeText={txt => {
                          customSetState({currentTodo: {...currentTodo, place: txt}});
                          this.placeFinder(getPredictions, txt);
                        }}
                        // onFocus={() => this.setState({showPredictions: true})}
                        onBlur={() => this.setState({showPredictions: false})}
                        editable={isLocationEditable}
                      />
                      {!isEditing && (
                      <TouchableOpacity style={{height: 32, width: 32, backgroundColor: '#ffcc00', borderRadius: 5, justifyContent: "center", alignItems: 'center'}} onPress={this.handlePopUp}>
                        <Image source={currentLoc} style={{height: 24, width: 24}} />
                      </TouchableOpacity>)}
                    </View>)}
                </View>
              </View>)}
            </View>

            {showPredictions && predictions.length === 0 && (
              <View
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    width: width - 40,
                  }}>
                  <Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>
                    Loading...
                  </Text>
                </View>
              </View>
            )}

            {!showPopup && showPredictions && predictions.length > 0 && (
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
                      {prediction.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {!showPopup && isEditing && (
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
                        ...currentTodo,
                        is_complete: !currentTodo.is_complete,
                      },
                    })
                  }
                  style={{marginTop: 10, marginLeft: 5}}
                  value={currentTodo.is_complete}
                  tintColors={{true: '#ffcc00', false: '#fff'}}
                />
              </View>
            )}
            {!showPopup && (<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: isSaveDisabled ? '#ffcc0040' : '#ffcc00',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 5,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  !isEditing ? addTodos(currentTodo) : updateTodos(currentTodo.id, 0);
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
                    Keyboard.dismiss();
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
            </View>)}
            {showPopup && (
              <TouchableOpacity
              style={{
                backgroundColor: isAddDisabled ? '#ffcc0040' : '#ffcc00',
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 5,
              }}
              disabled={isAddDisabled}
              onPress={() => {
                this.handleAddLocation();
                Keyboard.dismiss();
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#000',
                  width: width - 60,
                  textAlign: 'center',
                }}>
                Add
              </Text>
            </TouchableOpacity>
            )}
          </View>
        </React.Fragment>
        {showModel && currentTodo.is_birthday && (
          <View style={{flex: 1, position: 'absolute', left: 0, bottom: 0, backgroundColor: '#fff', overflow: 'hidden'}}>
            <View style={{position: 'relative', width: width, bottom: 0, left: 20, right: 20, overflow: 'hidden'}}>
              <DatePicker mode="datetime" date={sdate} minimumDate={new Date()} fadeToColor={'#000'} onDateChange={date => this.onChangeTime(date)} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginTop: 10}}>
              <TouchableOpacity style={{flex: 1, padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#000', marginRight: 5, backgroundColor: '#000'}} onPress={this.onClickOk}><Text style={{color: '#ffcd00', fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>Ok</Text></TouchableOpacity>
              <TouchableOpacity style={{flex: 1, padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#000', marginLeft: 5, backgroundColor: '#000'}} onPress={this.onClickCancel}><Text style={{color: '#ffcd00', fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </React.Fragment>
    );
  }
}
