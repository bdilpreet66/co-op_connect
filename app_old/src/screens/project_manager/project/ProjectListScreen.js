import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Modal, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { listProjects } from '../../../store/project'; // Assuming you have the user functions in a file named 'user.js'
import commonStyles from '../../../theme/commonStyles';
import theme from '../../../theme/theme';
import { Ionicons } from '@expo/vector-icons';


const ProjectListScreen = () => {
	const navigation = useNavigation();
	const [searchText, setSearchText] = useState('');
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [sortAscending, setSortAscending] = useState(false);
	const [statusFilter, setStatusFilter] = useState('');

	useFocusEffect(
		useCallback(() => {
			handleSearch();
		}, [sortAscending, statusFilter])
	);

	const renderFilterModal = () => (
		<Modal
			animationType="slide"
			transparent={false}
			visible={filterModalVisible}
			onRequestClose={() => {
				setFilterModalVisible(!filterModalVisible);
			}}
		>
			<View style={styles.modalView}>
				<Text style={styles.modalTitle}>Filter and Sort</Text>

				<View style={[styles.switchContainer]}>
					<Text style={{fontSize:18,marginRight:10,}}>Sort Ascending:</Text>
					<Switch
						onValueChange={() => setSortAscending(!sortAscending)}
						value={sortAscending}
						style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
					/>
				</View>

				<Text style={styles.modalText}>Status:</Text>
				<Picker
					selectedValue={statusFilter}
					style={commonStyles.input}
					onValueChange={(itemValue, itemIndex) => setStatusFilter(itemValue)}
				>
					<Picker.Item label="All" value="" />
					<Picker.Item label="Pending" value="pending" />
					<Picker.Item label="In Progress" value="in-progress" />
					<Picker.Item label="Completed" value="completed" />
				</Picker>
				<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary]} onPress={() => setFilterModalVisible(!filterModalVisible)}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
						<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>
							Done
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</Modal>
	);

	const loadProjects = async (cur_page = page) => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			const newProjects = await listProjects(cur_page, searchText, sortAscending, statusFilter); // Fetch projects from the first page
			
			if (cur_page == 1){
				setProjects(newProjects);
			} else {
				setProjects((prevProjects) => [...prevProjects, ...newProjects]);
			}
			
			setHasMore(newProjects.length > 0);
			setPage(cur_page + 1);
		} catch (error) {
			console.error('Error loading projects:', error);
		}

		setLoading(false);
	};

	const handleSearch = async () => {
		// Reset pagination and load projects based on the search text
		setPage(1);
		setProjects([]);
		setHasMore(true);
		loadProjects(1);
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity style={[styles.listItem]} onPress={() => navigation.navigate('View Project', { project_id: item._id, back_screen: 'Project List' })}>
			<View style={styles.rowContainer}>
				<Text>{item.name}</Text>
				<Text>{item.total_cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
			</View>
			<View style={styles.rowContainer}>
				{item.status == "pending" ?
					<Text style={[commonStyles.badge, commonStyles.badgeWarning, styles.badge]}>{item.status}</Text> :
					(item.status == "in-progress" ?
						<Text style={[commonStyles.badge, commonStyles.badgeInfo, styles.badge]}>{item.status}</Text> :
						<Text style={[commonStyles.badge, commonStyles.badgeSuccess, styles.badge]}>{item.status}</Text>
					)
				}
				{item.status == "completed" ?
					<Text>Completed: {item.completion_date}</Text> :
					<Text></Text>
				}
			</View>
		</TouchableOpacity>
	);

	const renderFooter = () => {
		if (!loading) return null;

		return <ActivityIndicator style={{ marginVertical: 20 }} />;
	};

	return (
		<View style={[commonStyles.container, styles.container]}>
			{renderFilterModal()}
			<Image source={require('../../../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain' />
			<Text style={commonStyles.heading}>Project Management</Text>
			<Text>Create and modify your projects.</Text>
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.button]} onPress={() => navigation.navigate('Create Project')}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
						<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>
							Create Project
						</Text>
						<Ionicons name="add-circle-outline" style={{ marginLeft: 10, color: theme.colors.white }} size={24} />
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.buttonTwenty]} onPress={() => setFilterModalVisible(true)}>
					<Ionicons name="filter" style={{ color: theme.colors.white }} size={24} />
				</TouchableOpacity>
			</View>

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
				data={projects}
				style={styles.listContainer}
				renderItem={renderItem}
				keyExtractor={(item) => item._id.toString()} // Assuming each member has a unique ID
				onEndReached={() => { loadProjects() }} // Load more projects when reaching the end of the list
				onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
				ListFooterComponent={renderFooter} // Show loading indicator at the bottom while loading more projects
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		padding: 20,
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

export default ProjectListScreen;
