import { BlackBishop, BlackKing, BlackKnight, BlackPond, BlackQueen, BlackRook, WhiteBishop, WhiteKing, WhiteKnight, WhitePond, WhiteQueen, WhiteRook } from "./Piece";

const whitePonds = {
    "a-2" : new WhitePond(),
    "b-2" : new WhitePond(),
    "c-2" : new WhitePond(),
    "d-2" : new WhitePond(),
    "e-2" : new WhitePond(),
    "f-2" : new WhitePond(),
    "g-2" : new WhitePond(),
    "h-2" : new WhitePond(),
};

const whiteRooks = {
    "a-1" : new WhiteRook(),
    "h-1" : new WhiteRook(),
};

const whiteBiships = {
    "c-1" : new WhiteBishop(),
    "f-1" : new WhiteBishop()
};

const whiteKnights = {
    "b-1" : new WhiteKnight(),
    "g-1" : new WhiteKnight()
};

const whiteKing = {
    "e-1" : new WhiteKing()
};

const whiteQueen = {
    "d-1" : new WhiteQueen()
};

const whitePieces = {
    ...whitePonds,
    ...whiteRooks,
    ...whiteBiships,
    ...whiteKnights,
    ...whiteKing,
    ...whiteQueen
};

const blackPonds = {
    "a-7" : new BlackPond(),
    "b-7" : new BlackPond(),
    "c-7" : new BlackPond(),
    "d-7" : new BlackPond(),
    "e-7" : new BlackPond(),
    "f-7" : new BlackPond(),
    "g-7" : new BlackPond(),
    "h-7" : new BlackPond(),
};

const blackRooks = {
    "a-8" : new BlackRook(),
    "h-8" : new BlackRook(),
};

const blackBiships = {
    "c-8" : new BlackBishop(),
    "f-8" : new BlackBishop()
};

const blackKnights = {
    "b-8" : new BlackKnight(),
    "g-8" : new BlackKnight()
};

const blackKing = {
    "e-8" : new BlackKing()
};

const blackQueen = {
    "d-8" : new BlackQueen()
};

const blackPieces = {
    ...blackPonds,
    ...blackRooks,
    ...blackBiships,
    ...blackKnights,
    ...blackQueen,
    ...blackKing
}

export const defaultChessLocations = {
    ...whitePieces,
    ...blackPieces
};