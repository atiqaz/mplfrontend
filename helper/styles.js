export const globalStyles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    form: {
      width: '100%', // Use a number for width
      padding: 20, // Padding in dp
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000', // For shadow in React Native
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 10, // Shadow blur radius
      elevation: 5, // For Android shadow
    },
    input: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1, // Use `borderWidth` instead of `border`
      borderColor: '#ccc', // Border color
      borderRadius: 5,
    },
    submit: {
      marginTop: 10,
      paddingVertical: 10, // Vertical padding
      paddingHorizontal: 20, // Horizontal padding
      backgroundColor: '#4caf50',
      color: '#fff', // React Native does not apply `color` to buttons; you may style text separately
      borderRadius: 5,
    },
    buttonStyles:(styles)=>{
      return {
        ...styles,
        backgroundColor: '#4caf50',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:50,
        
      }
    }
  };
  