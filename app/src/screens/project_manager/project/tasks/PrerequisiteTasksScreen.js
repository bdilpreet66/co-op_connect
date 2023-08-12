import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, FlatList,TouchableOpacity, Alert } from 'react-native';
import { navigation, useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { getAvailableTasks, createPrerequisite, deletePrerequisite } from '../../../../store/project';
import { Ionicons } from '@expo/vector-icons';

const PrerequisiteTasksScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project, task } = route.params;
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
        fetchTasks();
    }, [])
);

  const fetchTasks = async () => {
      const fetchedTasks = await getAvailableTasks(project, task);
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
  };

  const filterTasks = (query) => {
    const filtered = tasks.filter(task => task.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredTasks(filtered);
  };

  const toggleSwitch = async (preReq, value) => {
    try {
        if (value) {
            await createPrerequisite({task_id: task, prerequisite_task_id: preReq});
        } else {
            await deletePrerequisite(task, preReq);
        }
    } catch (error) {
      Alert.alert('Error',error.message);
    }
    
    fetchTasks();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer]} >
        <Text>{item.name}</Text>
        <Switch 
            onValueChange={(value) => toggleSwitch(item.id, value)}
            value={item.isPreReq ? true : false}
        />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.ctaContainer}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>          
          <Ionicons name="close-outline" style={{color:'#D85151'}} size={36} />
        </TouchableOpacity>      
        <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Prerequisites</Text>
        <Text></Text>     
      </View> 
      <View style={{paddingHorizontal:20,}}>
        <TextInput
            style={commonStyles.input}
            placeholder="Search tasks"
            value={search}
            onChangeText={(val) => {
              setSearch(val);
              filterTasks(val);
            }}
        />
        <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: theme.colors.greyBackground,
    borderRadius: 5,
    padding: 10,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    paddingTop: 60,    
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,    
    marginBottom: 30,
  },
  labelhidden: {
    opacity: 0,
  },
});

export default PrerequisiteTasksScreen;
