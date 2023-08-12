import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { Picker } from '@react-native-picker/picker';
import { getAllUsers } from '../../../../store/user';
import { createTask } from '../../../../store/project';
import { Ionicons } from '@expo/vector-icons';

const CreateTaskScreen = () => {
  const route = useRoute();
  const { project } = route.params;
  const navigation = useNavigation();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [assignedTo, setAssignedTo] = useState("");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const handleCreateTask = async () => {
    // Validate that start date is before end date
    if (!name || !description || !startDate || !endDate) {
      // Handle case when email is empty
      Alert.alert('Error','Please complete the form before submit.');
      return;
    }

    if (startDate > endDate) {
      Alert.alert('Error','Start date should be before end date.');
      return;
    }

    // Create a new task object
    const task = {
      name: name,
      description: description,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      assigned_to: assignedTo,
      project_id: project._id,
      status: "pending",
    };

    try {
      // Create the task in the database
      await createTask(task);
      
      // Navigate back to the previous screen or to the updated list of tasks
      navigation.goBack();
    } catch (error) {
      // Handle or display error if something goes wrong
      console.error(error);
      Alert.alert('Error','There was an error while creating the task.');
    }
  }

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  }

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  }

  return (
    <View style={styles.scroll}>
      <View style={styles.ctaContainer}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>          
          <Ionicons name="close-outline" style={{color:'#D85151'}} size={36} />
        </TouchableOpacity>      
        <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Create Task</Text>
        <TouchableOpacity onPress={handleCreateTask}>          
          <Ionicons name="checkmark-outline" style={{color:'#34A654'}} size={36} />
        </TouchableOpacity>
      </View> 
      <ScrollView> 
        <View style={[commonStyles.container,styles.container]}>
            <View style={styles.inputContainer}>
              <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  style={commonStyles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  style={[commonStyles.input,{ height: 140 }]}
              />   
            </View>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Start Date"
                    value={startDate.toLocaleString()}
                    editable={false}
                    style={[commonStyles.input]}
                />
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <View style={styles.inputContainer}>
                <TextInput
                    placeholder="End Date"
                    value={endDate.toLocaleString()}
                    editable={false}
                    style={[commonStyles.input]}
                />
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    display="default"
                    onChange={onEndDateChange}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={[styles.inputContainer, styles.border]}>
              <Picker
                style={[commonStyles.input]}
                selectedValue={assignedTo}
                onValueChange={setAssignedTo}>
                {users?.map((user, index) => <Picker.Item key={index} label={user.email} value={user.email} />)}
              </Picker>
            </View>               
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

export default CreateTaskScreen;
