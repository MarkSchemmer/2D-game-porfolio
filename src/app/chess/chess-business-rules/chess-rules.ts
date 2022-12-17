
// Things we need to deal with.
// Can piece move?
// Can piece attack?
// Does this cause check?
// Is there checkmate?
// This entity should live on piece? maybe it should.

import { isValue } from "utils/Utils";
import { ChessCell } from "../chess-utils/utils";
import { PieceName } from "../chess-utils/Piece";


/*
    First test implmentation is perfecting rules of the Pond.

    - When can move 2 moves
    - When can attack left and right
    - When reaches end of board it can change to better piece -> after game
    - When it's time to implement "En Passant" detection -> after game

*/

export class ChessRules {
    /*
        Logic for when a piece can move on attack? 

        - Causes check? -> will do this logic later in the game. 

        - Is it the other team's piece? only can take the
    
    */

    public canPondAttack = (currentCell: ChessCell, leftOrRightCell: ChessCell): boolean => {
        return leftOrRightCell.cellIsNotEmpty() && currentCell.piece.isNotSameColor(leftOrRightCell.piece);
    }

    // Method for when a pond can move left or right, it's not so much about 
    // moving left or right 
    public pondHasMoved = (cell): boolean => {
        return isValue(cell.piece) && cell.piece.hasMoved === true;
    }

    public pondHasNotMoved = (cell): boolean => {
        return !this.pondHasMoved(cell);
    }
    // Will add check logic later, basically asking can make a move if
    // this will cause check on the King. 

    public canPondMove2SpacesOnFirstMove = (cell, nextCell, nextNextCell): boolean => {
        return this.pondHasNotMoved(cell) && isValue(nextCell) && nextCell.cellIsEmpty() && isValue(nextNextCell) && nextNextCell.cellIsEmpty();
    }

    public canPondMove1SpaceForward = (cell, nextCell): boolean => {
        return isValue(nextCell) && nextCell.cellIsEmpty();
    }

    // The thought of pondCanMove will be
    // 


    // One public move that then determines if can move or not. 

   // public calculateMove


   // My idea for calculating moves for all pieces, call one method, then 
   // How do we even determine what direction we're going? 
   // Maybe it's a bit too early to implement this type of 
   // logic for the moment, but I surly can implement 
   // stand alone methods for the moment. 
   public calculate = (fromCell:ChessCell, toCell:ChessCell) => {
        switch(fromCell.piece.PieceName) {
            case PieceName.POND: {

            }
            default: {
                console.log("caluclating the default. ");
            }
        }
   }
}