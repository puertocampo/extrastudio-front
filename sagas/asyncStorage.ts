import { AsyncStorage } from 'react-native';

export const setStorage = async (itemObj: any) => {
  const itemList = Object.keys(itemObj).map(key => [key, itemObj[key]]);
  await AsyncStorage.multiSet(itemList);
}

export const getStorage = async (itemList: string[]) => {
  const dataList = await AsyncStorage.multiGet(itemList);
  let storageObj = {};
  dataList.forEach((data, index) => { storageObj[itemList[index]] = data[1] });
  return storageObj;
}

export const removeStorage = async (itemList: string[]) => {
  await AsyncStorage.multiRemove(itemList);
}