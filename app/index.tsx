import { Redirect } from "expo-router";

export default function Index() {
  // Redirect users into the Home tab route
  return <Redirect href="/home" />;
}
