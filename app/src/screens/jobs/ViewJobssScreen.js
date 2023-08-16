import React, { useState, useCallback, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import theme from '../../theme/theme';
import commonStyles from '../../theme/commonStyles';
import { applyForJob, getApplicationStatus } from '../../store/jobs';

const ViewJobScreen = () => {
  const route = useRoute();
  const { job } = route.params;
  const navigation = useNavigation();
  const [application, setApplication] = useState({
    jobId: job._id,
    userId: "",
    status: "not applied"
  })

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getApplicationStatus(job._id);
        if (data){
          setApplication(data);
        }
      })();

    }, [])
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const applyToJob = async () => {
    const data = await applyForJob(job._id);
    console.log(data)
    setApplication(data);
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Job Name:</Text>
            <Text style={styles.value}>{job.jobTitle}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Rate:</Text>
            <Text style={styles.value}>{job.compensationType === "unpaid"
              ? "unpaid"
              : (job.rateType === 'hourly' ? '$ ' + job.hourlyRate + '/h' : '$ ' + job.annualRate + '/Y')}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Work Setup:</Text>
            <Text style={styles.value}>{job.workSetup}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{job.jobLocation}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{job.status}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Posted:</Text>
            <Text style={styles.value}>{formatDate(job.postedDate)}</Text>
          </View>
        </View>


        <View style={styles.ctaContainer}>
          <Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>Skills</Text>
        </View>

        <View style={[styles.card]}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {job.skills.map((item, index) =>
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  backgroundColor: theme.colors.primary,
                  borderRadius: 15,
                  margin: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10
                }}
              >
                <Text style={{ color: 'white' }}>{item}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.ctaContainer}>
          <Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>Description</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.description}>
            <Text style={[styles.value, { textAlign: 'justify' }]}>{job.jobDescription}</Text>
          </View>
        </View>

        {application.status != "not applied" ? <>
          <View style={styles.ctaContainer}>
            <Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>Your Application Status</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.description}>
              <Text style={[styles.label]}>{application.status}</Text>
            </View>
          </View>
        </> : <View style={{ marginTop: 10 }}>
          <TouchableOpacity onPress={applyToJob} style={[commonStyles.button, commonStyles.buttonPrimary]}>
            <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Apply</Text>
          </TouchableOpacity>
        </View>}
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
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
  },
});

export default ViewJobScreen;
