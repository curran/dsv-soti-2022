import { useDataset } from './useDataset';
import { Viz } from './Viz';
import './App.css';

function App() {
  const dataset = useDataset();
  return (
    <div className="app">
      {dataset ? <Viz dataset={dataset} /> : <div>Loading...</div>}
    </div>
  );
}

export default App;
