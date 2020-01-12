import { AsyncStorage } from 'react-native';

export const getIdToken = async () => {
  await AsyncStorage.getItem('idToken');
}

export const setIdToken = async (idToken: string) => {
  await AsyncStorage.setItem('idToken', idToken);
}