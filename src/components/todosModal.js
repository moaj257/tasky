/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Keyboard,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Dimensions,
  Alert,
  Switch,
  ScrollView,
  Platform
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width} = Dimensions.get('window');

export default class TodosModal extends React.Component {
  state = {
    predictions: [],
    showPredictions: false,
    isLocationEditable: true,
    mapError: null,
    mode: null,
    showModel: false,
    date: null,
    time: null
  };

  placeFinder = async (func, q) => {
    if (q.length <= 3) {
      return;
    }
    // let predictions = {
    //   meta: {code: 200, requestId: '5ea95015211536324b5b8439'},
    //   response: {
    //     venues: [
    //       {
    //         id: '5014c4e9e4b097af8abacef9',
    //         name: 'Bharathi Park',
    //         location: {
    //           lat: 11.932934467463282,
    //           lng: 79.83429398684618,
    //           labeledLatLngs: [
    //             {
    //               label: 'display',
    //               lat: 11.932934467463282,
    //               lng: 79.83429398684618,
    //             },
    //           ],
    //           cc: 'IN',
    //           country: 'India',
    //           formattedAddress: ['India'],
    //         },
    //         categories: [
    //           {
    //             id: '4bf58dd8d48988d163941735',
    //             name: 'Park',
    //             pluralName: 'Parks',
    //             shortName: 'Park',
    //             icon: {
    //               prefix:
    //                 'https://ss3.4sqi.net/img/categories_v2/parks_outdoors/park_',
    //               suffix: '.png',
    //             },
    //             primary: true,
    //           },
    //         ],
    //         referralId: 'v-1588154673',
    //         hasPerk: false,
    //       },
    //       {
    //         id: '5c820a4d603d2a002ce459d1',
    //         name: 'French Park',
    //         location: {
    //           address: '83 JN Street\npondicherry',
    //           lat: 11.935769,
    //           lng: 79.83091,
    //           labeledLatLngs: [
    //             {label: 'display', lat: 11.935769, lng: 79.83091},
    //           ],
    //           postalCode: '605001',
    //           cc: 'IN',
    //           city: 'Puducherry',
    //           state: 'Union Territory of Puducherry',
    //           country: 'India',
    //           formattedAddress: [
    //             '83 JN Street',
    //             'pondicherry',
    //             'Puducherry 605001',
    //             'Union Territory of Puducherry',
    //             'India',
    //           ],
    //         },
    //         categories: [
    //           {
    //             id: '4bf58dd8d48988d103951735',
    //             name: 'Clothing Store',
    //             pluralName: 'Clothing Stores',
    //             shortName: 'Apparel',
    //             icon: {
    //               prefix:
    //                 'https://ss3.4sqi.net/img/categories_v2/shops/apparel_',
    //               suffix: '.png',
    //             },
    //             primary: true,
    //           },
    //         ],
    //         referralId: 'v-1588154673',
    //         hasPerk: false,
    //       },
    //       {
    //         id: '51e402ce498e6f1752d3add3',
    //         name: 'Raymond Park Avenue',
    //         location: {
    //           lat: 11.934395,
    //           lng: 79.826774,
    //           labeledLatLngs: [
    //             {label: 'display', lat: 11.934395, lng: 79.826774},
    //           ],
    //           cc: 'IN',
    //           country: 'India',
    //           formattedAddress: ['India'],
    //         },
    //         categories: [
    //           {
    //             id: '4bf58dd8d48988d106951735',
    //             name: "Men's Store",
    //             pluralName: "Men's Stores",
    //             shortName: "Men's Store",
    //             icon: {
    //               prefix:
    //                 'https://ss3.4sqi.net/img/categories_v2/shops/apparel_men_',
    //               suffix: '.png',
    //             },
    //             primary: true,
    //           },
    //         ],
    //         referralId: 'v-1588154673',
    //         hasPerk: false,
    //       },
    //       {
    //         id: '50189effe4b0deb6b21fe553',
    //         name: 'Hotel Sun Park',
    //         location: {
    //           lat: 11.933549510734087,
    //           lng: 79.82663492034125,
    //           labeledLatLngs: [
    //             {
    //               label: 'display',
    //               lat: 11.933549510734087,
    //               lng: 79.82663492034125,
    //             },
    //           ],
    //           cc: 'IN',
    //           country: 'India',
    //           formattedAddress: ['India'],
    //         },
    //         categories: [
    //           {
    //             id: '4bf58dd8d48988d1fa931735',
    //             name: 'Hotel',
    //             pluralName: 'Hotels',
    //             shortName: 'Hotel',
    //             icon: {
    //               prefix:
    //                 'https://ss3.4sqi.net/img/categories_v2/travel/hotel_',
    //               suffix: '.png',
    //             },
    //             primary: true,
    //           },
    //         ],
    //         referralId: 'v-1588154673',
    //         hasPerk: false,
    //       },
    //       {
    //         id: '5285896411d23c159db20304',
    //         name: 'Horti-Park KVK',
    //         location: {
    //           address: 'Ellaipillaichavady',
    //           crossStreet: 'Villupuram Road',
    //           lat: 11.930330052442894,
    //           lng: 79.82518496957002,
    //           labeledLatLngs: [
    //             {
    //               label: 'display',
    //               lat: 11.930330052442894,
    //               lng: 79.82518496957002,
    //             },
    //           ],
    //           postalCode: '605005',
    //           cc: 'IN',
    //           city: 'Puducherry',
    //           state: 'Union Territory of Puducherry',
    //           country: 'India',
    //           formattedAddress: [
    //             'Ellaipillaichavady (Villupuram Road)',
    //             'Puducherry 605005',
    //             'Union Territory of Puducherry',
    //             'India',
    //           ],
    //         },
    //         categories: [
    //           {
    //             id: '4bf58dd8d48988d11b951735',
    //             name: 'Flower Shop',
    //             pluralName: 'Flower Shops',
    //             shortName: 'Flower Shop',
    //             icon: {
    //               prefix:
    //                 'https://ss3.4sqi.net/img/categories_v2/shops/flowershop_',
    //               suffix: '.png',
    //             },
    //             primary: true,
    //           },
    //         ],
    //         referralId: 'v-1588154673',
    //         hasPerk: false,
    //       },
    //     ],
    //     geocode: {
    //       what: '',
    //       where: 'pondicherry in',
    //       feature: {
    //         cc: 'IN',
    //         name: 'Puducherry',
    //         displayName: 'Puducherry, Union Territory of Puducherry, India',
    //         matchedName: 'Pondicherry, Union Territory of Puducherry, IN',
    //         highlightedName:
    //           '<b>Pondicherry</b>, Union Territory of Puducherry, <b>IN</b>',
    //         woeType: 7,
    //         slug: 'puducherry-india',
    //         id: 'geonameid:1259425',
    //         longId: '72057594039187361',
    //         geometry: {
    //           center: {lat: 11.93381, lng: 79.82979},
    //           bounds: {
    //             ne: {lat: 11.989259814081308, lng: 79.85232329825784},
    //             sw: {lat: 11.78841565732688, lng: 79.75705811820067},
    //           },
    //         },
    //       },
    //       parents: [],
    //     },
    //   },
    // };

    let predictions = await func(q);
    if (predictions && predictions.response && predictions.response.venues) {
      this.setState({predictions: predictions.response.venues});
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

  onChangeTime = (event, selectedData) => {
    const {mode} = this.state;
    const currentData = selectedData || mode === 'date' ? date : time;
    this.setState({showModel: Platform.OS === 'ios', [mode]: currentData, mode: mode === 'date' ? 'time': 'date'});
  }

  render() {
    const {predictions, showPredictions, isLocationEditable, time, date, showModel, mode} = this.state;
    const {
      states,
      toggleAction,
      customSetState,
      addTodos,
      updateTodos,
      deleteTodos,
      getPredictions,
    } = this.props;
    const {assets, currentTodo, isEditing, isLocations, locations} = states;
    const {pin, calendar, text, close, blob1} = assets;

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
    if (
      currentTodo.title !== undefined &&
      currentTodo.title !== null &&
      currentTodo.title.length > 0 &&
      currentTodo.place !== undefined &&
      currentTodo.place !== null &&
      currentTodo.place.length > 0 &&
      currentTodo.lat !== undefined &&
      currentTodo.lat !== null &&
      currentTodo.lng !== undefined &&
      currentTodo.lng !== null &&
      currentTodo.placeId !== undefined &&
      currentTodo.placeId !== null
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
              {isEditing ? 'Update' : 'Add'} Todo
            </Text>
            <View
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
            </View>
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
            color: '#fff',
          }}>
          {currentTodo.is_birthday ? `Name` : `Title`}
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
            placeholder={currentTodo.is_birthday ? `John Doe` : `Green Peas`}
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
          {currentTodo.is_birthday ? `Date & Time` : `Location`}
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
          <Image source={currentTodo.is_birthday ? calendar : pin} style={{marginHorizontal: 5}} />
          {currentTodo.is_birthday ? 
            (<TextInput
              placeholder="Select Date & Time"
              placeholderTextColor="#ffcc0040"
              value={currentTodo.reminder_date_time_at}
              onFocus={() => this.setState({mode: 'date', showModel: true})} />) : 
            (<TextInput
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
              value={currentTodo.place}
              onChangeText={txt => {
                customSetState({currentTodo: {...currentTodo, place: txt}});
                this.placeFinder(getPredictions, txt);
              }}
              onFocus={() => this.setState({showPredictions: true})}
              onBlur={() => this.setState({showPredictions: false})}
              editable={isLocationEditable}
            />)}
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
                  {prediction.name}
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              backgroundColor: isSaveDisabled ? '#ffcc0040' : '#ffcc00',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 5,
            }}
            onPress={() => {
              Keyboard.dismiss();
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
        </View>
        {showModel && (
          <DateTimePicker mode={mode} value={mode === 'date' ? date : time} is24Hour={true} display="default" onChange={this.onChangeTime} />
        )}
      </View>
    );
  }
}
