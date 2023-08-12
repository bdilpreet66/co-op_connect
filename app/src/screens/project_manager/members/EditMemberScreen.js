import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { updateHours, updatePassword, deleteUser } from "../../../store/user";
import theme from '../../../theme/theme';
import commonStyles from '../../../theme/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { searchUsers } from "../../../store/user";


const EditMemberScreen = () => {
  const route = useRoute();
  const { email } = route.params;
  const navigation = useNavigation();
  const [isHoursExpanded, setIsHoursExpanded] = useState(true);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);
  const [user, setUser] = useState({});


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await searchUsers(email);
        if (user != null) {
          user.password = "";
          setUser(user); // Assuming that searchUsers returns an array and you want to use the first user found
        } else {
          Alert.alert('Error','Error getting user Data')
          handleCancel()
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [email]);


  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSetHours = async () => {
    if (!user.hourly_rate) {
      Alert.alert('Error','Please enter Hourly Rate.');
      return;
    }

    if (!isValidHourlyRate(user.hourly_rate)) {
      Alert.alert('Error','Please enter a valid hourly rate.');
      return;
    }

    // If validation passes and user doesn't exist, create user
    await updateHours(user); // Update the type and hourly_rate as per your requirements

    // Then redirect the user to the login screen or anywhere you want
    handleCancel();
  };

  const handleChangePassword = async () => {
    if (!user.password) {
      Alert.alert('Error','Please enter password.');
      return;
    }
  
    if (user.password.length < 8) {
      Alert.alert('Error','Password should be at least 8 characters long.');
      return;
    }

    // If validation passes and user doesn't exist, create user
    await updatePassword(user.email, user.password); // Update the type and hourly_rate as per your requirements

    // Then redirect the user to the login screen or anywhere you want
    handleCancel();
  };

  const handleDeleteUser = async () => {
    try{
      await deleteUser(user.email);

      handleCancel();
    } catch (e) {
      Alert("Error", e)
    }
  }
  
  const isValidHourlyRate = (hourlyRate) => {
    const rate = parseFloat(hourlyRate);
    return !isNaN(rate) && rate >= 0;
  };

  return (
    <View>
      <View style={styles.ctaContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Member List', )}>          
          <Ionicons name="close-outline" style={{color:'#D85151'}} size={36} />
        </TouchableOpacity>      
        <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Edit Member</Text>
        <Text></Text>
      </View> 
      <View style={styles.scroll}>
        <View>
          <TouchableOpacity style={styles.tabs} onPress={ () => { setIsHoursExpanded(!isHoursExpanded); setIsPasswordExpanded(false); } }>
              <Text style={styles.tabText}>{isHoursExpanded ? 'Hide User Info' : 'Set User Info'}</Text>
          </TouchableOpacity>
          {isHoursExpanded && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={user.first_name}
                onChangeText={(text) => setUser({ ...user, first_name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={user.last_name}
                onChangeText={(text) => setUser({ ...user, last_name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Job Title"
                value={user.job_title}
                onChangeText={(text) => setUser({ ...user, job_title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Hourly Rate"
                value={String(user.hourly_rate)}
                onChangeText={(rate) => setUser({ ...user, hourly_rate: rate })}
                keyboardType='decimal-pad'
              />
              <TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.buttonOverride]} onPress={handleSetHours}>
                <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Save Info</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity style={styles.tabs} onPress={ () => { setIsHoursExpanded(false); setIsPasswordExpanded(!isPasswordExpanded); } }>
              <Text style={styles.tabText}>{isPasswordExpanded ? 'Hide Password' : 'Change Password'}</Text>
          </TouchableOpacity>
          {isPasswordExpanded && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={true}
                value={user.password}
                onChangeText={(text) => setUser({ ...user, password: text })}
              />
              <TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.buttonOverride]} onPress={handleChangePassword}>
                <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Change Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {user.type != "admin" &&
          (
            <TouchableOpacity style={[commonStyles.button, commonStyles.buttonError, styles.deleteButton]} onPress={handleDeleteUser}>
              <Text style={[commonStyles.buttonText, commonStyles.buttonTexError]}>Delete User</Text>
            </TouchableOpacity>
          )
        }
      </View>
    </View>    
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: theme.colors.white,
    height: "100%",
    marginBottom: 90,    
    paddingHorizontal: 20,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    paddingTop: 60,    
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,        
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabs: {
    marginTop: 30,
    backgroundColor: theme.colors.greyBackground,
    padding: 20,
  },
  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  buttonOverride: {
    marginTop: 10,
    marginBottom: 10,
  },
  deleteButton: {
    bottom: 10
  }
});

export default EditMemberScreen;
