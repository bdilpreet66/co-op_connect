import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import commonStyles from '../../theme/commonStyles';
import theme from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { getProjectProgress, getProjectSummary} from '../../store/project';
import { formatDate } from '../../common/Date';
import { getStatus } from '../../common/Status';

const DashboardScreen = () => {
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      (async () => {

        const projects = await getProjectProgress();
        setProjects(projects);

        const summary = await getProjectSummary();
        setSummary(summary);

      })();
    }, [])
  );
  
  return (
    <View style={commonStyles.container}>
        <Image source={require('../../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain'/>
        <ScrollView style={{width:'100%',paddingHorizontal:20,}}>
          <View style={[styles.container]}>
            <View style={[styles.column,styles.column1]}>
              <View style={[styles.group, styles.completed]}>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Completed</Text>
                  <Text style={styles.white}>
                    <Ionicons name="checkbox-outline" size={18} />
                  </Text>
                </View>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Projects</Text>
                <Text style={styles.white}>{ summary.completed_projects}</Text>
                </View>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Tasks</Text>
                <Text style={styles.white}>{ summary.completed_tasks}</Text>
                </View>
              </View>
              <View style={[styles.group, styles.inprogress]}>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>In-Progress Tasks</Text>
                  <Text style={styles.white}><Ionicons name="timer-outline" size={18} /></Text>
                </View>
                <View style={[styles.item]}>
                <Text style={styles.white}>{ summary.inprogress_tasks }</Text>
                  <Text style={styles.white}></Text>
                </View>
              </View>
              <View style={[styles.group, styles.totalCost]}>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Total Cost</Text>
                  <Text style={styles.white}><Ionicons name="cash-outline" size={ 18 } /></Text>
                </View>
                <View style={[styles.item]}>
                <Text style={styles.white}>$ { parseFloat(summary.total_cost).toFixed(2)}</Text>
                  <Text style={styles.white}></Text>
                </View>
              </View>
            </View>
            <View style={[styles.column,styles.column2]}>
              <View style={[styles.group, styles.overdue]}>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Overdue Tasks</Text>
                  <Text style={styles.white}><Ionicons name="alert-circle-outline" size={ 18 } /></Text>
                </View>
                <View style={[styles.item]}>
                <Text style={styles.white}>{ summary.overdue_tasks}</Text>
                  <Text style={styles.white}></Text>
                </View>
              </View>
              <View style={[styles.group, styles.pending]}>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Pending Tasks</Text>
                  <Text style={styles.white}><Ionicons name="hourglass-outline" size={ 18 } /></Text>
                </View>
                <View style={[styles.item]}>
                  <Text style={styles.white}>{ summary.pending_tasks}</Text>
                  <Text style={styles.white}></Text>
                </View>
              </View>
              <View style={[styles.group, styles.default]}>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Total</Text>
                  <Text style={styles.white}><Ionicons name="list-outline" size={ 18 } /></Text>
                </View>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Projects</Text>
                  <Text style={styles.white}>{ summary.total_projects }</Text>
                </View>
                <View style={[styles.item]}>
                  <Text style={ styles.white }>Tasks</Text>
                  <Text style={styles.white}>{ summary.total_tasks }</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: '100%' }}>            
            {projects.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => navigation.navigate('View Project', { project_id: item._id, back_screen: 'PmDashboard' })}>
                <View style={{ width: '40%' }}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={[styles.itemText, { color: theme.colors.grey, marginTop: 8 }]}>Due - {formatDate(item.completion_date)}</Text>
                </View>
                <View style={{ width: '30%' }}>
                  <Text style={[styles.itemText, commonStyles.badge, getStatus(item.status), { textAlign: 'center' }]}>
                    {item.status}
                  </Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Text style={styles.itemText}>{(item.progress).toFixed(0)}%</Text>
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
    marginBottom: 30,
  },
  column: {
    flex: 1,
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 14,
  },
});

export default DashboardScreen;

