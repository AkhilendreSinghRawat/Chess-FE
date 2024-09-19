import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import BoardLayout from './BoardLayout';
import { CheckStatus } from './type';
import PromotionModal from './PromotionalModal';

function App() {
  const [positions, setPositions] = useState<Record<string, string>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>({
    isCheck: false,
    isMate: false,
  });
  const [promotionModal, setPromotionModal] = useState<string | false>(false);
  const BackendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  const getCurrentPositions = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/positions`);
      const { positions, isCheck, isMate } = res.data;
      setPositions(positions);
      setCheckStatus({ isCheck, isMate });
    } catch (err) {
      console.error(err);
    }
  };

  const getAvailableMoves = async (key: string) => {
    try {
      const res = await axios.get(`${BackendUrl}/available-moves?key=${key}`);
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

  const handleMakeMove = async (key: string, promotionPiece?: string) => {
    try {
      await axios.post(`${BackendUrl}/move`, {
        currSquare: selectedSquare,
        newSquare: key,
        promotionPiece,
      });
      handleResetSelectedSquareData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSquareClick = (key: string) => {
    if (selectedSquare && availableMoves.includes(key)) {
      if (['0', '7'].includes(key[0]) && positions[selectedSquare][2] === 'p') {
        // pawn will be promoted now
        setPromotionModal(key);
        return;
      }

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
      await axios.post(`${BackendUrl}/reset`);
      handleResetSelectedSquareData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromotion = (promotionPiece: string) => {
    if (!promotionModal) return console.error('Error: No promotion key was provided');

    handleMakeMove(promotionModal, promotionPiece);
    setPromotionModal(false);
  };

  useEffect(() => {
    getCurrentPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <PromotionModal
        isOpen={!!promotionModal}
        onClose={() => setPromotionModal(false)}
        onSelectPiece={handlePromotion}
      />
    </>
  );
}

export default App;
