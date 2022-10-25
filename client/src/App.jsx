import { EthProvider } from "./contexts/EthContext";
import Demo from "./components/Demo";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <Demo />
    </EthProvider>
  );
}

export default App;
