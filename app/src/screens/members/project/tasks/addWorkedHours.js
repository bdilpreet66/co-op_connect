import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { createWorkedHour } from '../../../../store/project';
import { Ionicons } from '@expo/vector-icons';
import { getUserData } from "../../../../store/creds"

const AddWorkedHourScreen = () => {
    const route = useRoute();
    const { task } = route.params; // Assuming task is passed in route parameters.
    const navigation = useNavigation();
  
    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("0");
    const [recordedDate, setRecordedDate] = useState(new Date());
  
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const handleCreateWorkedHour = async () => {
        if (hours <= 0 && minutes <= 0) {
            Alert.alert('Error','Please record some work hours.');
            return;
        }

        if (minutes > 60 ) {
          Alert.alert('Error','You cannot record more minutes than 60.');
            return;
        }
        
        if (hours > 23 ) {
          Alert.alert('Error','You cannot record more hours than 24.');
            return;
        }

        let user = await getUserData();
  
        const workedHour = {
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            recorded_date: recordedDate.toISOString(),
            approved: 0,
            recorded_by: user.email,
            task_id: task // Use actual user email here.
        };
    
        try {
            await createWorkedHour(workedHour);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error','There was an error while recording the worked hours.');
        }
    }
  
    const onDateChange = (event, selectedDate) => {
      setShowDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setRecordedDate(selectedDate);
      }
    }
  
    return (
    <View style={styles.scroll}>
      <View style={styles.ctaContainer}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" style={{color:'#D85151'}} size={36} />
        </TouchableOpacity>      
        <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Add Work Hours</Text>
        <TouchableOpacity onPress={handleCreateWorkedHour}>
          <Ionicons name="checkmark-outline" style={{color:'#34A654'}} size={36} />
        </TouchableOpacity>      
      </View> 
      <ScrollView> 
        <View style={[commonStyles.container,styles.container]}>
            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Hours"
                value={hours}
                onChangeText={setHours}
                style={commonStyles.input}
            />
            </View>
            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Minutes"
                value={minutes}
                onChangeText={setMinutes}
                style={commonStyles.input}
            />
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Recorded Date"
                    value={recordedDate.toLocaleString()}
                    editable={false}
                    style={[commonStyles.input]}
                />
                {showDatePicker && (
                <DateTimePicker
                    value={recordedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
                )}
            </View>
            </TouchableOpacity>
        </View>    
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({  
  scroll: {
    backgroundColor: theme.colors.white,
    height: "100%",
    marginBottom: 90
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    paddingTop: 60,    
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
  },
  ctaButton: {    
    width: 'auto',    
    borderWidth: 2,
    borderColor: theme.colors.primary,
    position: 'absolute',
    right: 20,
    bottom: 0,
  },
  ctaButtonText: {
    color: theme.colors.black,    
  },
  container: {    
    alignItems: 'flex-start',    
    padding: 20,
  },  
  button: {
    marginTop: 20,
    marginBottom: 20,   
  }, 
  inputContainer: {
    marginTop: 20,
  },
  border: {
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: 5,
  }
});

export default AddWorkedHourScreen;
