import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Image } from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useNavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';

import { COLOR, FONTS } from './src/utils/constants';
import DashboardScreen from './src/screens/modules/Dashboard/DashboardScreen';
import BusinessScreen from './src/screens/modules/Business/BusinessScreen';
import CustomerScreen from './src/screens/modules/Customer/CustomerScreen';
import PolicyDetailsScreen from './src/screens/modules/Customer/PolicyDetailsScreen';
import QuotationScreen from './src/screens/modules/Quotation/QuotationScreen';
import SignInScreen from './src/screens/modules/SignIn/SignInScreen';
import SplashScreen from './src/screens/modules/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearToken } from './src/utils/tokenManager';
import { AuthActions } from './src/Redux/AuthRedux';
import MessageModal from './src/screens/components/MessageModal';
import { createNavigationContainerRef } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

// ---------- Header Context for dynamic title ----------
type HeaderContextType = {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
};

const HeaderContext = React.createContext<HeaderContextType>({
  headerTitle: 'Dashboard',
  setHeaderTitle: () => { },
});

const useHeader = () => React.useContext(HeaderContext);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const RootStack = createNativeStackNavigator();

// ---------- Tab stacks (root screens for each tab) ----------
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
  </Stack.Navigator>
);

const BusinessStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BusinessMain" component={BusinessScreen} />
  </Stack.Navigator>
);

const CustomerStack = () => {
  const { setHeaderTitle } = useHeader();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={{
        focus: (e) => {
          // Update header based on which screen is focused
          if (e.target?.startsWith('PolicyDetails')) {
            setHeaderTitle('Policy Details');
          } else if (e.target?.startsWith('CustomerMain')) {
            setHeaderTitle('Customer');
          }
        },
      }}
    >
      <Stack.Screen name="CustomerMain" component={CustomerScreen} />
      <Stack.Screen name="PolicyDetails" component={PolicyDetailsScreen} />
    </Stack.Navigator>
  );
};

const QuotationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="QuotationMain" component={QuotationScreen} />
  </Stack.Navigator>
);

// ---------- Tab title mapping ----------
const TAB_TITLES: Record<string, string> = {
  DashboardTab: 'Dashboard',
  BusinessTab: 'Business',
  CustomerTab: 'Customer',
  QuotationTab: 'Quotation',
};

// ---------- Bottom tabs ----------
const BottomTabs = () => {
  const insets = useSafeAreaInsets();
  const { setHeaderTitle } = useHeader();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLOR.SECONDARY_COLOR,
        tabBarInactiveTintColor: COLOR.WHITE_COLOR,
        tabBarStyle: {
          backgroundColor: COLOR.PRIMARY_COLOR,
          borderTopWidth: 0,
          elevation: 5,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
      screenListeners={{
        focus: (e) => {
          // Update header title when tab gets focus
          const tabName = e.target?.split('-')[0];
          if (tabName && TAB_TITLES[tabName]) {
            setHeaderTitle(TAB_TITLES[tabName]);
          }
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="chart-box-outline" size={size || 24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="BusinessTab"
        component={BusinessStack}
        options={{
          tabBarLabel: 'Business',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="bullseye" size={size || 24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="CustomerTab"
        component={CustomerStack}
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="account-multiple-outline" size={size || 24} color={color} />
          ),
        }}
        // Make tapping Customer tab always return to its root screen
        listeners={({ navigation }) => ({
          tabPress: async e => {
            // Try to emulate "go to root" behavior for nested Customer stack
            const state = navigation.getState();
            const tabRoute = state.routes.find((r: any) => r.name === 'CustomerTab');
            const nestedState = tabRoute?.state;

            if (nestedState && (nestedState.index ?? 0) > 0) {
              e.preventDefault();
              navigation.navigate('CustomerTab', { screen: 'CustomerMain' });
            }
          },
        })}
      />

      <Tab.Screen
        name="QuotationTab"
        component={QuotationStack}
        options={{
          tabBarLabel: 'Quotation',
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="account-cash-outline" size={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ---------- Main Stack (wraps BottomTabs) ----------
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

// ---------- Drawer content ----------

const drawerItems = [
  { label: 'Dashboard', icon: 'home-outline', tab: 'DashboardTab' },
  { label: 'Business', icon: 'bullseye', tab: 'BusinessTab' },
  { label: 'Customer', icon: 'account-multiple-outline', tab: 'CustomerTab' },
  { label: 'Quotation', icon: 'currency-usd', tab: 'QuotationTab' },
  { label: 'Logout', icon: 'logout', tab: 'Logout' },
];

// Map tab -> root screen inside that tab's stack
const TAB_ROOT_SCREENS = {
  DashboardTab: 'DashboardMain',
  BusinessTab: 'BusinessMain',
  CustomerTab: 'CustomerMain',
  QuotationTab: 'QuotationMain',
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const activeTab = getActiveTab(props.state);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const navigateToTab = (tabName: any) => {
    props.navigation.closeDrawer();
    const rootScreen = TAB_ROOT_SCREENS[tabName];

    console.log({ rootScreen })

    // Navigate to MainTabs -> Tabs -> specific tab
    // The MainStack structure prevents duplicate screens
    props.navigation.navigate('MainTabs', {
      screen: 'Tabs',
      params: { screen: tabName },
    });
  };

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = async () => {
    try {
      props.navigation.closeDrawer();
      clearToken();
      await AsyncStorage.removeItem('persist:root');
      await AsyncStorage.removeItem('userDetails');

      // reset the root navigator to Auth
      const rootNav = props.navigation.getParent(); // RootStack
      if (rootNav && typeof rootNav.reset === 'function') {
        rootNav.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      } else {
        props.navigation.navigate('Auth');
      }
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const localImageSource = require('./src/assets/images/CovertonAppLogo.png');


  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <View style={styles.headerTextContainer}>
          <Image style={styles.logo} source={localImageSource} />
        </View>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
          <MaterialDesignIcons name="close" size={24} color={COLOR.PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
      {drawerItems.map(item => {
        if (item.tab === 'Logout') {
          return (
            <DrawerItem
              key={item.tab}
              label={item.label}
              icon={({ color, size }) => <MaterialDesignIcons name={item.icon} size={size || 24} color={color} />}
              activeTintColor={COLOR.PRIMARY_COLOR}
              inactiveTintColor={COLOR.PRIMARY_COLOR}
              activeBackgroundColor={COLOR.SECONDARY_COLOR + '20'}
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
              onPress={handleLogoutPress}
            />
          );
        }

        return (
          <DrawerItem
            key={item.tab}
            label={item.label}
            icon={({ color, size }) => <MaterialDesignIcons name={item.icon} size={size || 24} color={color} />}
            focused={activeTab === item.tab}
            activeTintColor={COLOR.PRIMARY_COLOR}
            inactiveTintColor={COLOR.PRIMARY_COLOR}
            activeBackgroundColor={COLOR.SECONDARY_COLOR + '20'}
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
            onPress={() => navigateToTab(item.tab)}
          />
        );
      })}

      {/* Logout Confirmation */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={handleCancelLogout}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to Log Out?</Text>

            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelLogout}>
                <Text style={styles.cancelButtonText}>No</Text>
              </Pressable>

              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmLogout}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

// ---------- Drawer navigator ----------
const AppDrawer = () => {
  const [headerTitle, setHeaderTitle] = React.useState('Dashboard');

  return (
    <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: COLOR.PRIMARY_COLOR },
          headerTintColor: COLOR.WHITE_COLOR,
          headerTitleStyle: { fontWeight: 'bold' },
          overlayColor: COLOR.BLACK_COLOR + '88',
        }}
      >
        <Drawer.Screen
          name="MainTabs"
          component={MainStack}
          options={{ title: headerTitle }}
        />
      </Drawer.Navigator>
    </HeaderContext.Provider>
  );
};

// ---------- helpers ----------

const getActiveTab = (state: any) => {
  // Navigate through: Drawer state -> MainTabs route -> MainStack state -> Tabs route -> BottomTabs state
  if (!state || !state.routes) return 'DashboardTab';

  const drawerRoute = state.routes[state.index ?? 0];
  const mainStackState = drawerRoute?.state;

  if (mainStackState?.routes) {
    const mainStackRoute = mainStackState.routes[mainStackState.index ?? 0];
    // If currently on Tabs screen (BottomTabs)
    if (mainStackRoute?.name === 'Tabs' && mainStackRoute.state?.routes) {
      const tabState = mainStackRoute.state;
      return tabState.routes[tabState.index ?? 0]?.name || 'DashboardTab';
    }
  }

  return 'DashboardTab';
};

// ---------- Auth stack & root ----------
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
  </Stack.Navigator>
);

const AppEntry = () => <AppDrawer />;

const SessionHandler = () => {
  const dispatch = useDispatch();
  const isSessionExpired = useSelector((state: any) => state.auth.isSessionExpired);

  const handleClose = () => {
    dispatch(AuthActions.setSessionExpired(false));
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  };

  return (
    <MessageModal
      visible={isSessionExpired}
      title="Session Expired"
      message="Your session has expired. Please login again to continue."
      type="error"
      onClose={handleClose}
    />
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Auth" component={AuthStack} />
          <RootStack.Screen name="App" component={AppEntry} />
        </RootStack.Navigator>
      </NavigationContainer>
      <SessionHandler />
    </SafeAreaProvider>
  );
};

export default App;

// ---------- styles ----------
const styles = StyleSheet.create({
  drawerContent: { flex: 1 },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextContainer: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.FONT_BOLD,
    color: COLOR.PRIMARY_COLOR,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: FONTS.FONT_REGULAR,
    color: COLOR.PRIMARY_COLOR,
    opacity: 0.8,
  },
  closeButton: { padding: 4 },
  separator: {
    height: 1,
    backgroundColor: COLOR.PRIMARY_COLOR + '30',
    marginBottom: 8,
  },
  drawerLabel: {
    fontSize: 15,
    fontFamily: FONTS.FONT_MEDIUM,
  },
  drawerItem: {
    borderRadius: 8,
    marginLeft: 4,
  },
  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: COLOR.BLACK_COLOR + '66',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLOR.WHITE_COLOR,
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.FONT_BOLD,
    color: COLOR.PRIMARY_COLOR,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: FONTS.FONT_REGULAR,
    color: COLOR.PRIMARY_COLOR,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLOR.PRIMARY_COLOR,
    backgroundColor: COLOR.WHITE_COLOR,
  },
  confirmButton: {
    backgroundColor: COLOR.PRIMARY_COLOR,
  },
  cancelButtonText: {
    color: COLOR.PRIMARY_COLOR,
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: 14,
  },
  confirmButtonText: {
    color: COLOR.WHITE_COLOR,
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: 14,
  },
  logo: {
    width: '75%',
    height: 80,
  }
});
