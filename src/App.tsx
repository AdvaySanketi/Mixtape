import './App.css';
import { Routes, Route } from 'react-router-dom';
import Player from './Player';
import CreateMixtape from './Create';
import EditMixtape from './Edit';

function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<CreateMixtape />} />
                <Route path='/playback/:id' element={<Player />} />
                <Route path='/remix/:id' element={<EditMixtape />} />
            </Routes>
        </div>
    );
}

export default App;
