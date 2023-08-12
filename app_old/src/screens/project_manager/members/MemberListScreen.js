import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { listUsers } from '../../../store/user'; // Assuming you have the user functions in a file named 'user.js'
import commonStyles from '../../../theme/commonStyles';
import theme from '../../../theme/theme';
import { Ionicons } from '@expo/vector-icons';


const MemberListScreen = () => {
	const navigation = useNavigation();
	const [searchText, setSearchText] = useState('');
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);

	useFocusEffect(
		useCallback(() => {
			handleSearch()
		}, [])
	);

	const loadMembers = async (cur_page = page) => {
		if (loading || !hasMore) return;

		setLoading(true);

		try {
			const users = await listUsers(cur_page, searchText); // Fetch members using the 'listUsers' function

			setMembers((prevMembers) => [...prevMembers, ...users]);
			setHasMore(users.length > 0);
			setPage(cur_page + 1);
		} catch (error) {
			console.error('Error loading members:', error);
		}

		setLoading(false);
	};

	const handleSearch = async () => {
		// Reset pagination and load members based on the search text
		setPage(1);
		setMembers([]);
		setHasMore(true);
		loadMembers(1);
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity style={[{ width: '100%' }, styles.listItem]} onPress={() => navigation.navigate('Edit Member', { email: item.email })}>
			<View style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}>
				<Text>{item.email}</Text>
				<Text>Hourly Rate - ${item.hourly_rate}</Text>
			</View>
			<View>
				{item.type == "admin" ?
					<Text style={[commonStyles.badge, commonStyles.badgeSuccess, styles.badge]}>{item.type}</Text> :
					<Text style={[commonStyles.badge, commonStyles.badgeDefault, styles.badge]}>{item.type}</Text>
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
			<Image source={require('../../../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain' />
			<Text style={commonStyles.heading}>Member Management</Text>
			<Text>Create and modify your team member.</Text>
			<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.button]} onPress={() => navigation.navigate('Create Member')}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
					<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>
						Create Member
					</Text>
					<Ionicons name="add-circle-outline" style={{ marginLeft: 10, color: theme.colors.white }} size={24} />
				</View>
			</TouchableOpacity>
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
				data={members}
				renderItem={renderItem}
				keyExtractor={(item) => item.email.toString()} // Assuming each member has a unique ID
				onEndReached={() => { loadMembers() }} // Load more members when reaching the end of the list
				onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
				ListFooterComponent={renderFooter} // Show loading indicator at the bottom while loading more members
				style={[styles.listContainer]}
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
	icon: {
		width: 20,
		height: 15,
		alignSelf: 'center',
	},
	listItem: {
		backgroundColor: '#F8F8F8',
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	badge: {
		width: 100,
		textAlign: 'center',
		marginTop: 5,
	},
	listContainer: {
		width: '100%'
	},
});

export default MemberListScreen;
