import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import commonStyles from '../../../theme/commonStyles';
import theme from '../../../theme/theme';
import { addProject } from '../../../store/project';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreateProjectScreen = () => { 
  const navigation = useNavigation(); 
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");  

  const handleCreateProject = () => {
    let errMessage = "";
    if (!name) {
       errMessage +=  "Name is required.";
    }
    if (!description) {
      errMessage +=  "\nDescription is required.";      
    }
    if (errMessage != "") {
      Alert.alert(errMessage);
    }
    else {
      addProject(name,description);      
      Alert.alert("Success", "Project created successfully.",[
        {
          text: 'OK',
          onPress: () => navigation.navigate('Project List'),      
        },        
      ]);
    }      
  }

  return (
    <View style={styles.scroll}>
      <View style={styles.ctaContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Project List')}>          
          <Ionicons name="close-outline" style={{color:'#D85151'}} size={36} />
        </TouchableOpacity>      
        <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Project Details</Text>
        <TouchableOpacity onPress={handleCreateProject}>          
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
    paddingHorizontal: 15,    
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
});

export default CreateProjectScreen;