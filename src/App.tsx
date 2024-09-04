import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import BoardLayout from './BoardLayout';
import { CheckStatus } from './type';

function App() {
  const [positions, setPositions] = useState<Record<string, string>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>({
    isCheck: false,
    isMate: false,
  });

  const getCurrentPositions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/positions');
      const { positions, isCheck, isMate } = res.data;
      setPositions(positions);
      setCheckStatus({ isCheck, isMate });
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

    if (positions[key]) {
      getAvailableMoves(key);
    } else {
      setAvailableMoves([]);
    }

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
      <BoardLayout
        isCheck={checkStatus.isCheck}
        positions={positions}
        handleSquareClick={handleSquareClick}
        availableMoves={availableMoves}
      />
      {checkStatus.isMate ? <div>💀 {checkStatus.isCheck} 💀</div> : null}
      <button onClick={handleReset}>Reset</button>
    </>
  );
}

export default App;
