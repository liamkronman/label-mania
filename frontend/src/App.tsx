import "./App.css";
import Game from "./components/Game";
import Login from './components/Login';
import Signup from './components/Signup';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="login" element={<Login />} />
				<Route path="signup" element={<Signup />} />

				<Route path="/" element={<Game />} />

			</Routes>
		</Router>
	);
}

export default App;
