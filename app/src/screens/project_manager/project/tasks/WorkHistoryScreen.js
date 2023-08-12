import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { listWorkHours, approveWorkHour, disapproveWorkHour } from '../../../../store/project';
import { Ionicons } from '@expo/vector-icons';

const WorkHistoryModal = () => {
  const route = useRoute();
  const { task } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);  

  const [workHistory, setWorkHistory] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchWorkHistory = async () => {
        setWorkHistory([]);
        setPage(1);
        setHasMore(true);
        await loadHours(1);
    };

    fetchWorkHistory();
  }, []));
  
  const loadHours = async (cur_page = page) => {
    if (loading || !hasMore) return;
    setLoading(true);
  
    try {
      const newHours = await listWorkHours(cur_page, task); // Fetch projects from the first page
  
      setWorkHistory((prevProjects) => [...prevProjects, ...newHours]);
      setHasMore(newHours.length > 0);
      setPage(cur_page + 1);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  
    setLoading(false);
  };

  const approveHours = async (id) => {
    setHasMore(true);
    setPage(1);
    setWorkHistory([]);
    await approveWorkHour(id);
    await loadHours(1);
  }

  const deleteHours = async (id) => {
    setWorkHistory([]);
    setPage(1);
    setHasMore(true);
    await disapproveWorkHour(id);
    await loadHours(1);
  }

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
            <TouchableOpacity onPress={() => {deleteHours(item._id)}}>
              <Text style={{ color: "red" }}>undo</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>Approved</Text>
              <Ionicons name="ios-checkmark-circle" size={24} color="green" />
            </View>
          </>
        ) : (
          <TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.button]} onPress={() => {approveHours(item._id)}}>
            <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Approve</Text>
          </TouchableOpacity>
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
            <TouchableOpacity>
                <Text style={styles.labelhidden}></Text>
            </TouchableOpacity>      
        </View>
        <View style={styles.modalView}>
            <FlatList
                data={workHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()} // Assuming each member has a unique ID
                onEndReached={()=> {loadHours()}} // Load more projects when reaching the end of the list
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
  labelhidden: {
    opacity: 0,
  },
});

export default WorkHistoryModal;
