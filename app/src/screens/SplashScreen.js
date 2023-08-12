import { useEffect } from 'react';
import { getUserData } from "../store/creds"

const Splash = ({navigation}) => {  

  useEffect(() => {
    checkLoggedInUser();
  }, []);
  
  const checkLoggedInUser = async () => {
    // Check if there is a logged-in user in AsyncStorage or any other storage mechanism    
    const user = await getUserData();

    // Redirect to appropriate screen
    if (user != null) {
      if (user.type === 'admin') {
        navigation.navigate('ProjectManagerTabs', { screen: "Dashboard"});
      } else {
        navigation.navigate('MemberTabs', { screen: "Dashboard"});
      }
    }
    else {
      navigation.navigate('Login');
    }
  };

};

export default Splash;
