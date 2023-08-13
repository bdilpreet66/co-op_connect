import React, { useState, useCallback, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import theme from '../../theme/theme';
import commonStyles from '../../theme/commonStyles';
import Clipboard from '@react-native-clipboard/clipboard';

const ViewEventScreen = () => {
  const route = useRoute();
  const { event } = route.params;
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);

  const [eventData, setEventData] = useState(event);

  useFocusEffect(
    useCallback(() => {
      (async () => {

        // const taskData = await getTasksByEvent(event_id);
        // setTasks(taskData);

      })();

    }, [])
  );

  const handleCopyLink = () => {
    Clipboard.setString(event.linkOrLocation);
    alert("Link copied to clipboard!");
  }


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Event Name:</Text>
            <Text style={styles.value}>{event.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Event Type:</Text>
            <Text style={styles.value}>{event.type}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{formatDate(event.start)}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{formatDate(event.end)}</Text>
          </View>
          <View style={styles.description}>
            <Text style={[styles.value, { textAlign: 'justify' }]}>{event.description}</Text>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Location/Link</Text>
          <TextInput
            placeholder="Link"
            value={event.linkOrLocation}
            style={commonStyles.input}
            editable={false}
          />
          <TouchableOpacity onPress={handleCopyLink} style={[commonStyles.button, commonStyles.buttonPrimary, { marginTop: 1 }]}>
            <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Copy Location/Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    padding: 20,
    width: "100%"
  },
  card: {
    backgroundColor: theme.colors.greyBackground,
    padding: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 800
  },
  value: {
    fontSize: 20,
  },
  description: {
    flex: 1,
    padding: 10,
  }
});

export default ViewEventScreen;
