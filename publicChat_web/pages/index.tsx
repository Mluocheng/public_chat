import Layout from "./components/layout";
import { AppProvider } from '../contex'
export default function Home() {
  return <AppProvider><Layout /></AppProvider>;
}
