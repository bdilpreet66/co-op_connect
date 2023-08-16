import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { listJobs } from '../../store/jobs';
import commonStyles from '../../theme/commonStyles';
import theme from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';


const JobListScreen = () => {
	const navigation = useNavigation();
	const [searchText, setSearchText] = useState('');
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);

	useFocusEffect(
		useCallback(() => {
			handleSearch();
		}, [])
	);

	const loadJobs = async (cur_page = page) => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			const newJobs = await listJobs(cur_page, searchText); // Fetch jobs from the first page
			
			if (cur_page == 1){
				setJobs(newJobs);
			} else {
				setJobs((prevJobs) => [...prevJobs, ...newJobs]);
			}
			
			setHasMore(newJobs.length > 0);
			setPage(cur_page + 1);
		} catch (error) {
			console.error('Error loading jobs:', error);
		}

		setLoading(false);
	};

	const handleSearch = async () => {
		// Reset pagination and load jobs based on the search text
		setPage(1);
		setJobs([]);
		setHasMore(true);
		loadJobs(1);
	};


	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity style={[styles.listItem]} onPress={() => navigation.navigate('ViewJob', { job: item })}>
			<View style={styles.rowContainer}>
				<Text>{item.jobTitle}</Text>
				<Text>
					{item.compensationType === "unpaid" 
						? "unpaid" 
						: (item.rateType === 'hourly' ? '$ '+ item.hourlyRate +'/h' : '$ '+ item.annualRate +'/Y')}
				</Text>
			</View>
			<View style={styles.rowContainer}>
				<Text>Work Setup:</Text>
				<Text>{item.workSetup}</Text>
			</View>
			<View style={styles.rowContainer}>
				<Text>Job Location:</Text>
				<Text>{item.jobLocation}</Text>
			</View>
		</TouchableOpacity>
	);

	const renderFooter = () => {
		if (!loading) return null;

		return <ActivityIndicator style={{ marginVertical: 20 }} />;
	};

	return (
		<View style={[commonStyles.container, styles.container]}>

			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					autoCapitalize='none'
					onChangeText={setSearchText}
					value={searchText}
				/>
				<TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
					<Ionicons name="search" size={24} color="black" />
				</TouchableOpacity>
			</View>
			<FlatList
				data={jobs}
				style={styles.listContainer}
				renderItem={renderItem}
				keyExtractor={(item) => item._id.toString()} // Assuming each member has a unique ID
				onEndReached={() => { loadJobs() }} // Load more jobs when reaching the end of the list
				onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
				ListFooterComponent={renderFooter} // Show loading indicator at the bottom while loading more jobs
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

export default JobListScreen;
