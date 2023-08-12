import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import commonStyles from '../../theme/commonStyles';
import theme from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { getInprogressOverdueTasks, getProjectSummaryByMember, listIncompletePrerequisites } from '../../store/project';
import { formatDate } from '../../common/Date';
import { statusBadge } from '../../common/Status';

const DashboardScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      (async () => {

        const tasks = await getInprogressOverdueTasks();
        setTasks(tasks);

        const summary = await getProjectSummaryByMember();
        setSummary(summary);

      })();
    }, [])
  );

  const handleTaskView = async (task) => {
    const prerequisitesData = await listIncompletePrerequisites(task._id);
    if (prerequisitesData.length > 0) {
        Alert.alert('Message', 'This task is not allowed to view as it has an incomplete pre-requisite.');
    }
    else {
        //navigation.navigate('View Task', {task})
        navigation.navigate('View Task', { taskid: task._id })
    }        
}

  return (
    <View style={commonStyles.container}>
      <Image source={require('../../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain' />
      <ScrollView style={{width:'100%'}}>
        <View style={[styles.container]}>
          <View style={[styles.column, styles.column1]}>
            <View style={[styles.group, styles.completed]}>
              <View style={[styles.item]}>
                <Text style={styles.white}>Completed</Text>
                <Text style={styles.white}>
                  <Ionicons name="checkbox-outline" size={18} />
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>Projects</Text>
                <Text style={styles.white}>{summary.completed_projects}</Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>Tasks</Text>
                <Text style={styles.white}>{summary.completed_tasks}</Text>
              </View>
            </View>
            <View style={[styles.group, styles.inprogress]}>
              <View style={[styles.item]}>
                <Text style={styles.white}>In-Progress Tasks</Text>
                <Text style={styles.white}><Ionicons name="timer-outline" size={18} /></Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>{summary.inprogress_tasks}</Text>
                <Text style={styles.white}></Text>
              </View>
            </View>
            <View style={[styles.group, styles.totalCost]}>
              <View style={[styles.item]}>
                <Text style={styles.white}>Total Income</Text>
                <Text style={styles.white}><Ionicons name="cash-outline" size={18} /></Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>$ {parseFloat(summary.total_cost).toFixed(2)}</Text>
                <Text style={styles.white}></Text>
              </View>
            </View>
          </View>
          <View style={[styles.column, styles.column2]}>
            <View style={[styles.group, styles.overdue]}>
              <View style={[styles.item]}>
                <Text style={styles.white}>Overdue Tasks</Text>
                <Text style={styles.white}><Ionicons name="alert-circle-outline" size={18} /></Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>{summary.overdue_tasks}</Text>
                <Text style={styles.white}></Text>
              </View>
            </View>
            <View style={[styles.group, styles.pending]}>
              <View style={[styles.item]}>
                <Text style={styles.white}>Pending Tasks</Text>
                <Text style={styles.white}><Ionicons name="hourglass-outline" size={18} /></Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>{summary.pending_tasks}</Text>
                <Text style={styles.white}></Text>
              </View>
            </View>
            <View style={[styles.group, styles.default]}>
              <View style={[styles.item]}>
                <Text style={styles.white}>Total</Text>
                <Text style={styles.white}><Ionicons name="list-outline" size={18} /></Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>Projects</Text>
                <Text style={styles.white}>{summary.total_projects}</Text>
              </View>
              <View style={[styles.item]}>
                <Text style={styles.white}>Tasks</Text>
                <Text style={styles.white}>{summary.total_tasks}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ width: '100%' }}>
          <Text style={[styles.title, commonStyles.bold]}>My Tasks</Text>
          {tasks.map((item, index) => (            
              <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handleTaskView(item)}>
                <View style={{ width: '60%', marginRight: 10 }}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  {statusBadge(item.status, item.end_date)}
                </View>
                <View style={{ width: '40%' }}>
                  <Text style={[styles.itemText]}>Due - {formatDate(item.end_date)}</Text>
                  <Text style={[styles.itemText, { color: theme.colors.grey }]}>{item.project_id.name}</Text>
                </View>
              </TouchableOpacity>            
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  column: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'space-around',
  },
  group: {
    alignItems: 'flex-start',
    borderRadius: 6,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  completed: {
    backgroundColor: '#2F9C95',
  },
  inprogress: {
    backgroundColor: '#01BAEF',
  },
  totalCost: {
    backgroundColor: '#8CB48A',
  },
  overdue: {
    backgroundColor: '#EF767A',
  },
  pending: {
    backgroundColor: '#E5B164',
  },
  default: {
    backgroundColor: '#3C3C3C',
  },
  column1: {
    marginRight: 7,
  },
  column2: {
    marginLeft: 7,
  },
  white: {
    color: theme.colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 14,
  },
  title: {
    fontSize: theme.fontSize.medium,
    paddingHorizontal: 15,
  }
});

export default DashboardScreen;