import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, Image, Alert } from 'react-native';
import theme from '../theme/theme';
import commonStyles from '../theme/commonStyles';
import { validateLogin } from "../store/user";
import { saveUserData, getUserData } from "../store/creds";

const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  useEffect(()=>{
      let user = getUserData();
      if(user){
        navigation.navigate('userDrawer', { screen: "Jobs"});
      }
  },[])

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const handleLogin = async () => {
    // Email validation
    if (!email) {
      // Handle case when email is empty
      Alert.alert('Error','Please enter your email.');
      return;
    }
  
    // Password validation
    if (!password) {
      // Handle case when password is empty
      Alert.alert('Error','Please enter your password.');
      return;
    }
  
    // Perform login validation
    const user = await validateLogin(email, password);
    
    if (user.success) {
        // Save user details if rememberMe is true
        await saveUserData(user.data);

        navigation.navigate('userDrawer', { screen: "Jobs"});
    } else {
      // Handle case when login validation fails
      alert(user.message);
    }
  };  

  return (
    <View style={commonStyles.container}>
      <Image source={require('../../assets/logo_icon.png')} style={commonStyles.logo} resizeMode='contain'/>
      <Text style={commonStyles.heading}>Login to Co-op Connect</Text>
      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Email</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={setEmail}
          value={email}
          autoCapitalize='none'
          keyboardType='email-address'          
        />
      </View>
      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            autoCapitalize='none'
            onChangeText={setPassword}
            value={password}            
            secureTextEntry={hidePassword}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={toggleHidePassword}>
            <Image 
              source={hidePassword ? require('../../assets/eye-closed.png') : require('../../assets/eye-open.png')} 
              style={styles.icon}               
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={[commonStyles.button,commonStyles.buttonPrimary, styles.button]} onPress={handleLogin}>
        <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('SignUp')}>
        <Text style={[commonStyles.bold]}>Don't have an account? </Text><Text style={[commonStyles.link,commonStyles.bold]}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({    
  passwordContainer: {
    backgroundColor: theme.colors.greyBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
  },
  passwordInput: {
    paddingHorizontal: 12,    
    paddingVertical: 10,
    minWidth: "88%"
  },
  iconContainer: {
    borderLeftWidth: 1,
    borderColor: theme.colors.grey,
    padding: 10,
  },
  icon: {    
    width: 20,
    height: 15,
    alignSelf: 'center', 
  },
  label: {
    margin: 8,
    alignSelf: 'center',
    color: theme.colors.grey,
  },
  linkContainer: {
    flexDirection: "row",    
  },
  button: {
    width: '90%',
  }  
});

export default Login;