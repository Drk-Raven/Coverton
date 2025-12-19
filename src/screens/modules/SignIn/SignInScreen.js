import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { COLOR, FONTS } from '../../../utils/constants';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../../../Redux/AuthRedux';
import { setTokens } from '../../../utils/tokenManager';
import MessageModal from '../../components/MessageModal';
// <-- IMPORT YOUR API HELPERS: update the path if needed -->
import { sendOTP, verifyOTP } from '../../../API/AuthAPI';

const { width } = Dimensions.get('window');

const SignInScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
  });

  const showModal = (title, message, type = 'info') => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  // Request OTP from server
  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Enter email', 'Please enter an email before requesting OTP.');
      return;
    }
  
    Keyboard.dismiss();
    setLoading(true);
  
    try {
      const response = await sendOTP({ emailId: trimmedEmail });
  
      const message = response?.message ?? 'OTP sent to your email';
      const isUserNotExist =
        response === 'User does not exist' || response?.error === 'User does not exist';
  
      if (isUserNotExist) {
        showModal('Failed to send OTP', 'User does not exist', 'error');
        return;
      }
  
      showModal('OTP Sent', message, 'success');
      setIsOtpStep(true);
      setOtpValue('');
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        'Failed to send OTP. Please try again.';
  
      showModal('Send OTP Failed', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP with server and store returned user details locally
  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      Alert.alert('OTP required', 'Please enter the OTP sent to your email.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await verifyOTP({
        emailId: email.trim(),
        otp: otpValue.trim(),
      });

      // Check if login was successful
      if (response.loginStatus !== 'Valid') {
        showModal(
          'Verification Failed',
          response.loginMessage || 'Invalid OTP. Please try again.',
          'error'
        );
        return;
      }

      // Store tokens in memory for immediate API access (before redux-persist writes to AsyncStorage)
      setTokens(
        response.accessToken,
        response.refreshToken,
        response.tokenExpiry,
      );

      // Dispatch Redux action to store user and tokens
      // Redux-persist will automatically save to AsyncStorage
      dispatch(
        AuthActions.storeAuthUser(
          response,
          response.accessToken,
          response.refreshToken,
          response.tokenExpiry,
        ),
      );

      showModal('Signed In', 'Verification successful.', 'success');

      // navigate into app — adjust route name if needed
      if (navigation && navigation.replace) navigation.replace('App');
    } catch (err) {
      const errMsg =
        (err && (err.message || err.error || JSON.stringify(err))) ||
        'OTP verification failed';
      showModal('Verify OTP failed', String(errMsg), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryAction = () => {
    if (isOtpStep) {
      handleVerifyOtp();
    } else {
      handleSendOtp();
    }
  };

  const buttonLabel = isOtpStep ? 'Verify & Sign In' : 'Send OTP';
  const disabled = loading || !email.trim() || (isOtpStep && !otpValue.trim());
  const localImageSource = require('../../../assets/images/CovertonAppLogo.png');

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Image style={styles.logo} source={localImageSource} />
              </View>
              <Text style={styles.title}>
                {isOtpStep ? 'Enter OTP' : 'Welcome'}
              </Text>
              <Text style={styles.subtitle}>
                {isOtpStep
                  ? 'We’ve sent a 6-digit code to your email'
                  : 'Sign in to continue your journey'}
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused,
                  isOtpStep && styles.inputContainerDisabled,
                ]}
              >
                <MaterialDesignIcons
                  name="email-outline"
                  size={20}
                  color={emailFocused ? COLOR.PRIMARY_COLOR : '#999'}
                />
                <TextInput
                  placeholder="your.email@example.com"
                  placeholderTextColor="#999"
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isOtpStep && !loading}
                />
              </View>
              <Text style={styles.helperText}>
                We’ll send a one-time password to this email.
              </Text>

              {isOtpStep && (
                <View style={styles.otpBlock}>
                  <Text style={styles.label}>OTP</Text>
                  <OtpInput
                    numberOfDigits={4}
                    focusColor={COLOR.PRIMARY_COLOR}
                    autoFocus={true}
                    hideStick={true}
                    blurOnFilled={true}
                    disabled={loading}
                    type="numeric"
                    secureTextEntry={false}
                    focusStickBlinkingDuration={500}
                    onTextChange={text => setOtpValue(text)}
                    onFilled={text => {
                      setOtpValue(text);
                    }}
                    textInputProps={{ accessibilityLabel: 'One-Time Password' }}
                    textProps={{
                      accessibilityRole: 'text',
                      accessibilityLabel: 'OTP digit',
                      allowFontScaling: false,
                    }}
                    theme={{
                      containerStyle: styles.otpContainer,
                      pinCodeContainerStyle: styles.pinCodeContainer,
                      focusedPinCodeContainerStyle:
                        styles.activePinCodeContainer,
                      filledPinCodeContainerStyle:
                        styles.filledPinCodeContainer,
                      disabledPinCodeContainerStyle:
                        styles.disabledPinCodeContainer,
                      pinCodeTextStyle: styles.pinCodeText,
                      placeholderTextStyle: styles.placeholderText,
                      focusStickStyle: styles.focusStick,
                    }}
                  />

                  <View style={styles.otpFooterRow}>
                    <TouchableOpacity
                      disabled={loading}
                      onPress={() => {
                        setIsOtpStep(false);
                        setOtpValue('');
                      }}
                    >
                      <Text style={styles.changeEmailText}>Change email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={loading}
                      onPress={async () => {
                        // resend OTP: call sendOTP again
                        setLoading(true);
                        try {
                          const response = await sendOTP({
                            emailId: email.trim(),
                          });
                          showModal(
                            'OTP Resent',
                            response?.message || 'OTP resent successfully',
                            'success'
                          );
                          setOtpValue('');
                        } catch (err) {
                          const errMsg =
                            (err &&
                              (err.message ||
                                err.error ||
                                JSON.stringify(err))) ||
                            'Failed to resend OTP';
                          // Alert.alert('Resend failed', String(errMsg));
                          showModal(
                            'Resend OTP Failed',
                            String(errMsg),
                            'error'
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.signInButton,
                  disabled && styles.signInButtonDisabled,
                ]}
                onPress={handlePrimaryAction}
                activeOpacity={0.9}
                disabled={disabled}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.signInText}>{buttonLabel}</Text>
                    <MaterialDesignIcons
                      name="arrow-right"
                      size={18}
                      color="#fff"
                    />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Please use the email provided.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <MessageModal
          visible={modalVisible}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

/* ---------- styles (unchanged from simplified version) ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#F8FAFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  iconContainer: {
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: '#1e293b',
    fontFamily: FONTS.FONT_BOLD,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 13,
    fontFamily: FONTS.FONT_REGULAR,
    textAlign: 'center',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: FONTS.FONT_BOLD,
    color: '#475569',
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  inputContainerFocused: {
    borderColor: COLOR.PRIMARY_COLOR,
  },
  inputContainerDisabled: {
    opacity: 0.8,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1e293b',
    fontFamily: FONTS.FONT_REGULAR,
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: FONTS.FONT_REGULAR,
  },
  otpBlock: {
    marginTop: 14,
  },
  otpContainer: {
    marginTop: 8,
    alignSelf: 'center',
  },
  pinCodeContainer: {
    width: width * 0.12,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePinCodeContainer: {
    borderColor: COLOR.PRIMARY_COLOR,
  },
  filledPinCodeContainer: {
    borderColor: '#4ade80',
  },
  disabledPinCodeContainer: {
    backgroundColor: '#e5e7eb',
  },
  pinCodeText: {
    fontSize: 18,
    fontFamily: FONTS.FONT_BOLD,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#cbd5f5',
  },
  focusStick: {
    width: 2,
    height: 16,
  },
  otpFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  changeEmailText: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: FONTS.FONT_BOLD,
  },
  resendText: {
    fontSize: 13,
    color: COLOR.PRIMARY_COLOR,
    fontFamily: FONTS.FONT_BOLD,
  },
  signInButton: {
    backgroundColor: COLOR.PRIMARY_COLOR,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  signInButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.FONT_BOLD,
    marginRight: 8,
  },
  registerContainer: {
    alignSelf: 'center',
    marginTop: 18,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: FONTS.FONT_REGULAR,
  },
  logo: {
    width: '70%',
    height: 80,
  },
});
