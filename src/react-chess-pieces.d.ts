declare module 'react-chess-pieces' {
  import React from 'react';

  type PieceProps = {
    piece: string;
  };

  const Piece: React.FC<PieceProps>;

  export default Piece;
}
