import commonStyles from "../theme/commonStyles";
import { Text } from "react-native";

export const getStatus = (status) => {
    switch(status) {
        case 'overdue': 
          return commonStyles.badgeError;
        case 'completed':
          return commonStyles.badgeSuccess;
        case 'pending':
          return commonStyles.badgeWarning;
        case 'in-progress':
          return commonStyles.badgeInfo;
        default:
          return commonStyles.badgeDefault;
    }
}

export const statusBadge = (status, end) => {    
    let badgeClass = commonStyles.badge;
    let styles = [badgeClass];
    if ((new Date(end)) > (new Date())){    
      if (status === 'pending') {
        styles.push(commonStyles.badgeWarning);
      }
      
      if (status === 'in-progress') {
        styles.push(commonStyles.badgeInfo);
      }
    } else {
      styles.push(commonStyles.badgeError);
      if (status !== 'completed'){
        status = "overdue"
      }
    }
      
    if (status === 'completed') {
      styles.push(commonStyles.badgeSuccess);
    }
    
    return (
      <Text style={[styles,{ textAlign: 'center',width:100, marginTop:5,}]}>{status}</Text>
    )
  }