import { useDataset } from './useDataset';
import './App.css';

function App() {
  const dataset = useDataset();
  console.log(dataset);

  return <div className="App">Hello</div>;
}

export default App;
