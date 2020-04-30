import firestore from '@react-native-firebase/firestore';

export const Locations = () => {
  const ref = firestore().collection('locations');
  return ref;
};
