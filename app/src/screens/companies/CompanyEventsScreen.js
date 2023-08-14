import React, { useState, useCallback, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import theme from '../../theme/theme';
import commonStyles from '../../theme/commonStyles';
import { getUserData } from '../../store/creds';
import { getCompany, addComment, getAllComments} from '../../store/company'; 
import { Ionicons } from '@expo/vector-icons';

const ViewCompanyScreen = () => {
  const route = useRoute();
  const { company } = route.params;
  const navigation = useNavigation();

  const [companyData, setCompanyData] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {

        const data = await getCompany(company);
        setCompanyData(data);

        const companyComments = await getAllComments(companyData._id);
        setComments(companyComments);

      })();

    }, [])
  );

  const handleAddComment = async () => {
    if (comment.trim() === "") {
        alert("Please enter a comment before submitting.");
        return;
    }
  
    try {        
        const user = await getUserData();
        const comment_by = user.email;  // Use appropriate logic to fetch the logged-in username.
        await addComment(companyData._id, comment, comment_by);
        
        // After successfully adding the comment, refresh the comments for the company
        const refreshedComments = await getAllComments(companyData._id); // Assuming companyData has the _id field.
  
        setComments(refreshedComments);
  
        // Clear the comment input field
        setComment("");
  
    } catch (error) {
        console.error("Error in handleAddComment: ", error);
        alert("There was an error processing your request. Please try again.");
    }
  }
  

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Company Name:</Text>
            <Text style={styles.value}>{companyData.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{companyData.email}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Phone No:</Text>
            <Text style={styles.value}>{companyData.phoneNumber}</Text>
          </View>
          <View style={styles.description}>
            <Text style={[styles.value, { textAlign: 'justify' }]}>{companyData.additionalInfo}</Text>
          </View>
        </View>

					<View style={styles.inputContainer}>
						<Text style={commonStyles.inputLabel}>Comments</Text>
					</View>
					<View style={[styles.staticContent, styles.commentContainer]}>
						<TextInput
							placeholder="Write a comment"
							value={comment}
							onChangeText={setComment}
							style={[commonStyles.input, { textAlignVertical: 'top' }]}
							multiline
							numberOfLines={4}
						/>
						<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text></Text>
							<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.buttonComment]}>
								<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary, { fontWeight: 400 }]} onPress={handleAddComment}>
									ADD COMMENT <Ionicons name="add-circle-outline" size={16} />
								</Text>
							</TouchableOpacity>
						</View>
						<View>
							{comments.map((item) =>
								<View key={item._id}>
									<View style={[styles.commentItem]}>
										<Text>{item.comment}</Text>
										<Text style={[styles.commentAudit]}>{item.comment_by} | {item.comment_date}</Text>
									</View>
								</View>)
							}
						</View>
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
  },
	staticContent: {
		backgroundColor: theme.colors.greyBackground,
		padding: 10,
		borderRadius: 5,
		width: '100%',
		display: 'flex',
	},
	buttonComment: {
		marginTop: 15,
		width: 'auto',
		paddingVertical: 10,
	},
	commentItem: {
		backgroundColor: '#EEEEEE',
		padding: 10,
		marginVertical: 5,
		borderRadius: 10,
		color: '#414141',
	},
	commentAudit: {
		color: '#9B9B9B',
		textAlign: 'right',
	}
});

export default ViewCompanyScreen;
