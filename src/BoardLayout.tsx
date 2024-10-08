import './BoardLayout.css';
import Piece from 'react-chess-pieces';
import { BoardLayoutProps } from './type';

const BoardLayout = ({ isCheck, positions, availableMoves, handleSquareClick }: BoardLayoutProps) => {
  const renderSquares = () => {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const isBlack = (row + col) % 2 === 1;
      const squareKey = row + '-' + col;
      const piece = positions[squareKey];
      const availableMove = availableMoves?.includes(squareKey);
      const backgroundColor = (() => {
        if (isCheck === piece) {
          return 'red';
        }
        if (availableMove) {
          return 'lightcoral';
        }
        if (isBlack) {
          return 'gray';
        }
        return 'white';
      })();

      squares.push(
        <div key={i} className='square' onClick={() => handleSquareClick(squareKey)} style={{ backgroundColor }}>
          {piece ? <Piece piece={piece[0] === 'w' ? piece[2].toUpperCase() : piece[2]} /> : null}
        </div>
      );
    }
    return squares;
  };

  const renderLeftLabels = () => {
    const labels = [];
    for (let i = 0; i < 8; i++) {
      labels.push(
        <div key={`left-${i}`} className='label left'>
          {8 - i}
        </div>
      );
    }
    return labels;
  };

  const renderBottomLabels = () => {
    const labels = [];
    for (let i = 0; i < 8; i++) {
      labels.push(
        <div key={`bottom-${i}`} className='label bottom'>
          {String.fromCharCode(97 + i)}
        </div>
      );
    }
    return labels;
  };

  return (
    <div className='board-container'>
      <div className='board-container-inner'>
        <div className='labels-left'>{renderLeftLabels()}</div>
        <div className='chessboard'>{renderSquares()}</div>
      </div>
      <div className='labels-bottom'>{renderBottomLabels()}</div>
    </div>
  );
};

export default BoardLayout;
