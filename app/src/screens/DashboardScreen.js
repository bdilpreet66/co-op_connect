import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAppliedJobs } from '../store/jobs';
import commonStyles from '../theme/commonStyles';
import theme from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';


const DashboardScreen = () => {
	const navigation = useNavigation();
	const [jobs, setJobs] = useState([]);

	useFocusEffect(
		useCallback(() => {
			loadJobs();
		}, [])
	);

	const loadJobs = async () => {
		const newJobs = await getAppliedJobs();
		setJobs(newJobs);
	};


	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity style={[styles.listItem]}>
			<View style={styles.rowContainer}>
				<Text>{item.jobId.jobTitle}</Text>
				<Text>
					{item.jobId.compensationType === "unpaid" 
						? "unpaid" 
						: (item.jobId.rateType === 'hourly' ? '$ '+ item.jobId.hourlyRate +'/h' : '$ '+ item.jobId.annualRate +'/Y')}
				</Text>
			</View>
			<View style={styles.rowContainer}>
				<Text>Work Setup:</Text>
				<Text>{item.jobId.workSetup}</Text>
			</View>
			<View style={styles.rowContainer}>
				<Text>Job Location:</Text>
				<Text>{item.jobId.jobLocation}</Text>
			</View>
			<View style={styles.rowContainer}>
				<Text>Status:</Text>
				<Text>{item.status}</Text>
			</View>
			<View style={styles.rowContainer}>
				<Text>Applied On:</Text>
				<Text>{formatDate(item.appliedDate)}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={[commonStyles.container, styles.container]}>
			<FlatList
				data={jobs}
				style={styles.listContainer}
				renderItem={renderItem}
				keyExtractor={(item) => item._id.toString()} // Assuming each member has a unique ID
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		padding: 20,
		marginTop: 0,
	},
	button: {
		marginTop: 20,
		marginBottom: 20,
		width: "80.5%",
	},
	buttonTwenty: {
		marginLeft: 5,
		marginTop: 20,
		marginBottom: 20,
		width: "18%",
	},
	searchContainer: {
		backgroundColor: theme.colors.greyBackground,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: theme.colors.grey,
		borderRadius: 5,
		width: '100%',
		alignSelf: 'center',
	},
	searchInput: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		minWidth: "88%"
	},
	iconContainer: {
		borderLeftWidth: 1,
		borderColor: theme.colors.grey,
		padding: 10,
	},
	listContainer: {
		width: '100%'
	},
	listItem: {
		backgroundColor: '#F8F8F8',
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		width: "100%",
	},
	badge: {
		width: 100,
		textAlign: 'center',
		marginTop: 5,
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalTitle: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: 'bold'
	},
	modalText: {
		marginBottom: 15,		
		fontSize: 18,		
	},
	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15
	},
});

export default DashboardScreen;
