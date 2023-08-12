import theme from './theme';

export default {
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    paddingVertical: 20,
  },
  logo: {
    width: 40 * 2,
    height: 46 * 2,
    alignSelf: 'center', 
    marginTop: 64,
    marginBottom: 20,
  },
  logoLabel: {    
    height: 50,
    alignSelf: 'center',    
    marginTop: 40,
    marginBottom: 28,
  },
  heading: {
    fontSize: theme.fontSize.large,
    fontWeight: '600',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'left',
  },
  button: {    
    borderRadius: 5,
    width: '100%', // Adjust width as per your requirement
    alignSelf: 'center', // This will center the button
    paddingHorizontal: 24,
    paddingVertical: 18,    
    marginTop: 40,
    marginBottom: 40,    
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSuccess: {
    backgroundColor: theme.colors.success,
  },
  buttonDanger: {
    backgroundColor: theme.colors.warning,
  },
  buttonGray: {
    backgroundColor: theme.colors.grey,
  },
  buttonError: {
    backgroundColor: theme.colors.red,    
  },
  buttonText: {    
    textAlign: 'center', // Center the text inside the button    
  },
  buttonTextPrimary: {
    color: theme.colors.white,
  },
  buttonTexError: {
    color: '#D85151',
  },
  inputContainer: {
    width: '90%',  // Or any suitable value
    alignSelf: 'center',
    marginTop: 20,
  }, 
  input: {
    paddingHorizontal: 12,    
    paddingVertical: 10,
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    minWidth: "100%",
    fontSize: theme.fontSize.medium,
    backgroundColor: theme.colors.greyBackground,
  },  
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 10,    
  },
  bold: {
    fontWeight: theme.fontWeight.bold,    
  },
  link: {
    color: theme.colors.primary,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    color: theme.colors.white, 
    fontWeight: 400,
    fontSize: 12,   
  },
  badgeDefault: {
    backgroundColor: theme.colors.black,
  },
  badgeError: {
    backgroundColor: theme.colors.red,
  },
  badgeInfo: {
    backgroundColor: theme.colors.info,
  },
  badgeWarning: {
    backgroundColor: theme.colors.warning,
  },
  badgeSuccess: {
    backgroundColor: theme.colors.success,
  },
  badgeGrey: {
    backgroundColor: theme.colors.grey,
  },
  labelTopNav: {
    fontSize: theme.fontSize.small,
  },
  labelTopNavHeading: {
    fontSize: 18,
    fontWeight: 600,
  }
}