import React from 'react';
import './PromotionModal.css';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPiece: (piece: string) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, onClose, onSelectPiece }) => {
  if (!isOpen) return null;

  const pieces = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className='piece-selection'>
          {pieces.map(piece => (
            <button key={piece} onClick={() => onSelectPiece(piece[0])}>
              {piece}
            </button>
          ))}
        </div>
        <button className='close-button' onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PromotionModal;
