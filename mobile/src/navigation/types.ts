/**
 * Navigation type definitions for type-safe navigation.
 */

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

// Placeholder for future dashboard navigators
export type CitizenTabParamList = {
  Home: undefined;
  Complaints: undefined;
  Submit: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

export type OfficerTabParamList = {
  Home: undefined;
  Operations: undefined;
  Intelligence: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  CitizenDashboard: undefined;
  OfficerDashboard: undefined;
};
