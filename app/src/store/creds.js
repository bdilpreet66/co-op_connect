import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save user data to AsyncStorage
export const saveUserData = async (user) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Function to get user data from AsyncStorage
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Function to clear user data from AsyncStorage
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userData');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};