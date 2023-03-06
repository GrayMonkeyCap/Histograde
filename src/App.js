
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './Components/Main';
import Result from './Components/Result';
import ImageUploader from './Components/Upload';
import Upload from './Components/Upload';

function App() {
  return (<>
  <Routes>
        <Route path="/" element={ <Main/> } />
        <Route path="result" element={ <Result/> } />
      </Routes>
    <Main/>
    </>
  );
}

export default App;
