import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import BoardLayout from './BoardLayout';

function App() {
  const [positions, setPositions] = useState<Record<string, string>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);

  const getCurrentPositions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/positions');
      setPositions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAvailableMoves = async (key: string) => {
    try {
      const res = await axios.get(`http://localhost:8080/available-moves?key=${key}`);
      setAvailableMoves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSelectedSquareData = () => {
    getCurrentPositions();
    setSelectedSquare(null);
    setAvailableMoves([]);
  };

  const handleMakeMove = async (key: string) => {
    try {
      await axios.post('http://localhost:8080/move', {
        currSquare: selectedSquare,
        newSquare: key,
      });
      handleResetSelectedSquareData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSquareClick = (key: string) => {
    if (selectedSquare && availableMoves.includes(key)) {
      handleMakeMove(key);
      return;
    }

    getAvailableMoves(key);
    setSelectedSquare(key);
  };

  const handleReset = async () => {
    try {
      await axios.post('http://localhost:8080/reset');
      handleResetSelectedSquareData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCurrentPositions();
  }, []);

  return (
    <>
      <BoardLayout positions={positions} handleSquareClick={handleSquareClick} availableMoves={availableMoves} />
      <button onClick={handleReset}>Reset</button>
    </>
  );
}

export default App;
