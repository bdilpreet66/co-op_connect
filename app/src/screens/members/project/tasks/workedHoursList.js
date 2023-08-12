import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { listWorkHours } from '../../../../store/project';
import { Ionicons } from '@expo/vector-icons';

const WorkHistoryModal = () => {
  const route = useRoute();
  const { task, status } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);  

  const [workHistory, setWorkHistory] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchWorkHistory = async () => {
        setWorkHistory([]);
        setPage(1);
        await loadHours();
    };

    fetchWorkHistory();
  }, []));
  
  const loadHours = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
  
    try {
      const newHours = await listWorkHours(page, task); // Fetch projects from the first page
  
      setWorkHistory((prevhours) => [...prevhours, ...newHours]);
      setHasMore(newHours.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.listItem]} >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Time Recorded</Text>
          <Text>{item.hours}h : {item.minutes}m</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Date Recorded</Text>
          <Text>{item.recorded_date}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Total Cost</Text>
          <Text>$ {(item.hours * item.rate) + (item.minutes/60 * item.rate)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Added By</Text>
        <Text>{(item.recorded_by.first_name != "") ? item.recorded_by.first_name + " " + item.recorded_by.last_name: item.recorded_by.email}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 }}>
        {item.approved ? (
          <>
            <Text></Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>Approved</Text>
              <Ionicons name="ios-checkmark-circle" size={24} color="green" />
            </View>
          </>
        ) : (
          <>
            <Text></Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>Needs Approval</Text>
              <Ionicons name="ios-close-circle" size={24} color="red" />
            </View>
          </>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;

    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  return (
      <View style={styles.container}>
        <View style={styles.ctaContainer}> 
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="close-outline" style={{color:'#D85151'}} size={36} />
            </TouchableOpacity>      
            <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Worked Hours</Text>
            {status !== "completed" ? (
                <TouchableOpacity onPress={() => navigation.navigate('Add Worked Hours', { task })}>
                  <Ionicons name="add-outline" style={{color:'#34A654'}} size={36} />
                </TouchableOpacity>
              ) : <Text></Text>}
        </View> 
        <View style={styles.modalView}>
            <FlatList
                data={workHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()} // Assuming each member has a unique ID
                onEndReached={() => {loadHours}} // Load more projects when reaching the end of the list
                onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
                ListFooterComponent={renderFooter} 
            />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  listItem: {
    marginBottom: 20,
    backgroundColor: theme.colors.greyBackground,
    borderRadius: 5,
    padding: 10,
  },
});

export default WorkHistoryModal;
