export interface CheckStatus {
  isCheck: false | string;
  isMate: boolean;
}

export interface BoardLayoutProps {
  isCheck: false | string;
  positions: Record<string, string>;
  availableMoves: string[] | undefined;
  handleSquareClick: (key: string) => void;
}
