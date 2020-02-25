import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { R } from "schemas/rType";
import { MoveHistory, PlayerType, Square, whichPlayerType } from "schemas/tic-tac-toe-page/square.schema";
import { backToMenu, clearGlobalState,
  genericDispatch, setMoveHistory, setPlayStep, setSquare, setWinner, ticTacToeEnums } from "src/store/actions/ticTacToeActions";
import { TicTacToePageState } from "src/store/reducers/ticTacToePageReducer";
import { getStepAndSquares, SquareSelector } from "src/store/selectors/tictactoeSelectors";
import { isNullOrUndefined } from "util";
import { ai, deepClone, hasAnyBodyWon, human,
   isTie, miniMax, miniMaxOther, updateNewMoveHistory } from "utils/tic-tac-toe/Utils";
import { curry, isValue } from "utils/Utils";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {

  board: R<Square[][]> = null;
  squares: R<Square[]> = [];
  playStep: number = null;
  winner: PlayerType = null;
  moveHistory: R<MoveHistory[]> = [];
  isAiMove: boolean = null;

  whichPlayerTypeCurried: any;
  aiPlayerCurried: any;

  playerTypeWinners = false;

  @Input() playAgainstUser: boolean = null;
  @Input() ai: PlayerType = null;

  constructor(
    private store: Store<R<TicTacToePageState>>
  ) {
    // this.whichPlayerTypeCurried = this.whichPlayerTypeCurried.bind(this);
   }

  ngOnInit() {
    this.store.pipe(select(getStepAndSquares))
    .subscribe(
      (response: SquareSelector) => (
          this.board = response.squareList,
          this.playStep = response.playStep,
          this.winner = response.winner,
          this.squares = response.squareList[this.playStep],
          this.moveHistory = response.moveHistory
    ));

    if (this.playAgainstUser === false) {
        if (this.ai === PlayerType.PlayerX) {
          this.aiPlayerCurried = curry(whichPlayerType, 2)(n => n % 2 === 0 ? true : false);
          this.whichPlayerTypeCurried = curry(whichPlayerType, 2)(n => n % 2 === 0 ? true : false);
          // need to set who is going first...
          this.isAiMove = true;
          this.handleAiMove();
        } else {
          this.whichPlayerTypeCurried = curry(whichPlayerType, 2)(n => n % 2 === 0 ? true : false);
          this.aiPlayerCurried = curry(whichPlayerType, 2)(n => n % 2 === 0 ? true : false);
          // need to set who is going first...
          this.isAiMove = false;
          this.playerTypeWinners = true;
        }
     }
  }

  handleAiMove = () => {

    if (isValue(this.winner)) { return; }

    let bestScore: any = -Infinity;

    let bestMove: any;
    const newBoard = deepClone(this.board);
    const board = newBoard[this.playStep];

    const whichIsAi = this.playerTypeWinners === false ? ai : human;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < board.length; i++) {
        if (isNullOrUndefined(board[i].playerType)) {
          board[i].playerType = whichIsAi;
          const score = this.playerTypeWinners === false ? miniMax(board, 0, false) : miniMaxOther(board, 0, false);
          board[i].playerType = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
    }

    board[bestMove].playerType = whichIsAi;
    this.store.dispatch(setSquare([ ...newBoard, board ]));
    this.store.dispatch(setPlayStep(this.playStep + 1));
    this.updateMoveHist(board[bestMove]);
    this.checkIfWinner();
    this.isAiMove = false;
  }

  handleSquareClick = (square: Square) => {

    if (this.isAiMove) { return; }

    if (isValue(square.playerType) || isValue(this.winner)) { return; }

    let copyOfBoard = deepClone(this.board.slice(0, this.playStep + 1));

    const newBoard = copyOfBoard[this.playStep].map((sq: Square) => {
      return sq.id === square.id ?
      (sq.playerType = whichPlayerType(n => n % 2 === 0 ? true : false, this.playStep), sq)
      : sq;
    });
    copyOfBoard = [ ...copyOfBoard, deepClone(newBoard) ];

    this.store.dispatch(setSquare(copyOfBoard));
    this.store.dispatch(setPlayStep(this.playStep + 1));

    this.updateMoveHist(square);

    this.checkIfWinner();

    if (this.playAgainstUser !== true) {
      this.isAiMove = true;
      this.handleAiMove();
    }
  }

  updateMoveHist = (square: Square) => {
    const moveHist =  updateNewMoveHistory(
      [ ...this.moveHistory, new MoveHistory(this.playStep, square.coordinateIndex, this.board) ]
      , this.playStep
    ).slice(0, this.playStep + 1);

    this.store.dispatch(setMoveHistory(moveHist));
  }

  checkIfWinner = () => {
      const anyBodyWon = hasAnyBodyWon(this.board[this.playStep - 1]);
      if (anyBodyWon) {

          const { total, setOfWinningSquares } = anyBodyWon;

          const highlightWinningBoard =  this.board[this.playStep].map((sq: Square, idx: number) => {
            return setOfWinningSquares.includes(idx) ?
            (sq.isWinningSquare = true, sq) : sq;
          });

          this.store.dispatch(
            setSquare( [ ...this.board, highlightWinningBoard ] )
          );

          this.store.dispatch(setWinner(total[0].playerType));
      } else {
        this.checkIfTie();
      }
  }

  checkIfTie = () => {
    // check if sombody has tied
    if (isTie(this.board)) {
      this.store.dispatch(genericDispatch(PlayerType.Tie, ticTacToeEnums.MAKE_TIE));
    }
  }

  playAgain = () => {
    this.store.dispatch(clearGlobalState());
    if (this.ai === PlayerType.PlayerX && this.playAgainstUser === false) {
      this.isAiMove = true;
      this.handleAiMove();
    } else {
      this.isAiMove = false;
    }
  }

  handleStepHistClick = (move: MoveHistory) => {
    [
      () => setMoveHistory(updateNewMoveHistory(this.moveHistory, move.step)),
      () => setSquare( move.copyOfBoard ),
      () => setPlayStep(move.step)
    ].forEach(item => {
        this.store.dispatch(item());
    });
  }

  slowReplay = (step: number = this.moveHistory[this.moveHistory.length - 1].step) => {
    if (step === -1) { return; }
    setTimeout(() => {
        this.handleStepHistClick(this.moveHistory[step] as MoveHistory);
        this.slowReplay(step - 1);
    }, 1000);
  }

  backToMainMenu = () => {
    this.store.dispatch(backToMenu());
}
}
