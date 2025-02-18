import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, Button, ActivityIndicator, RadioButton, Snackbar } from 'react-native-paper';
import { globalStyles } from '../helper/styles';
import { widthPerWidth } from '../helper/dimensions';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import useAxios from '../helper/useAxios';
import useUserDetails from '../hooks/useUserDetails';
import { getUserProfile } from '../helper/Api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState('team');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const { login } = useAuth();
  const { fetchData, error: apiError } = useAxios();
  const { getMe } = useUserDetails();
  const {getUser}  = getUserProfile()

  const handleSubmit = async () => {
    if (!email || !password) {
      showSnackbar('Please fill all fields.', 'red');
      return;
    }

    setLoading(true);
    try {
      let url = checked === 'team' ? '/api/users/login' : '/api/players/login';
      console.log(url)
      const res = await fetchData({
        url: url,
        method: 'POST',
        data: { email, password },
      });

      if (res.status) {
      const userRes = await getUser(res.data.token)
      if(userRes.status){
        login(res.data.token, res.data.role);
      }
        
        // getMe(res.data.token);
        showSnackbar(res.message, 'green');
      } else {
        showSnackbar(res.message, 'red');
      }
    } catch (error) {
      showSnackbar('Something went wrong. Please try again.', 'red');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    if (apiError) showSnackbar(apiError, 'red');
  }, [apiError]);

  return (
    <View style={[globalStyles.container, styles.form]}>
      {/* Role Selection */}
      <View style={styles.radioContainer}>
        <View style={styles.radioOption}>
          <RadioButton
            value="team"
            status={checked === 'team' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('team')}
          />
          <Text>Team</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton
            value="player"
            status={checked === 'player' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('player')}
          />
          <Text>Player</Text>
        </View>
      </View>

      {/* Dynamic Header */}
      <Text style={styles.headerText}>
        Login as {checked === 'first' ? 'Team' : 'Player'}
      </Text>

      {/* Email Input */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      {/* Login Button */}
      <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : 'Login'}
      </Button>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Register Section */}
      <Button
        mode="outlined"
        onPress={() => router.push('playerRegistration')}
        style={styles.registerButton}
      >
        Register as Player
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.push('userRegister')}
        style={styles.registerButton}
      >
        Register as Team
      </Button>

      {/* Snackbar for messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        style={[styles.snackbar, { backgroundColor: snackbarColor }]}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: widthPerWidth(90),
    alignItems: 'center',
    alignSelf: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#555',
  },
  registerButton: {
    width: '100%',
    marginTop: 10,
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
});
