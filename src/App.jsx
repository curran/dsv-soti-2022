import { useDataset } from './useDataset';
import { Viz } from './Viz';
import './App.css';

function App() {
  const dataset = useDataset();
  return dataset ? <Viz dataset={dataset} /> : <div>Loading...</div>;
}

export default App;
