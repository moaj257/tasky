import firestore from '@react-native-firebase/firestore';

export const Todos = () => {
  const ref = firestore().collection('todos');
  return ref;
};
