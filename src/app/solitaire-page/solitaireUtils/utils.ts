import { generateRandomGuid, shuffle } from "utils/Utils";

interface ICard {
    imageurl: string;
    id: string;
    suite: string;
    value: string;
    power: number;
    isSelected: boolean;
    cardColor: CardColor;
}

export enum CardColor {
    BLACK = "BLACK",
    RED = "RED"
}

export enum Suits {
    DIAMOND = "DIAMOND",
    HEART = "HEART",
    SPADE = "SPADE",
    CLUB = "CLUB"
}

export const cardValues = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
    Ace: 14
};

export const isCardNextSmaller = (card: Card, stackCard: Card) => {

    if (card.suite !== stackCard.suite) { return false; }

    if (stackCard.power === 14) {
        return card.power === 2;
    }
    return card.power - 1 === stackCard.power;
};

export const generateDeckOfCards = (): Card[] =>
    Object.keys(Suits)
    .reduce(
        (acc, cur) =>
            [...acc, ...Object.keys(cardValues).map(val => new Card(cur, val))]
    , []);

export const rootImage = "../../../assets/cardImages/";

export class Card implements ICard {
    public id: string;
    public suite: string;
    public value: string;
    public power: number;
    public imageurl: string;
    public isSelected: boolean = false;
    public cardColor: CardColor;
    // image of back of card if facedown
    public backOfCard: string = "../../../assets/cardImages/card_background.png";

    public showBack: boolean = true;

    public showFront = () => {
        this.showBack = false;
    }

    public showBackOfCard = () => {
        this.showBack = true;
    }

    constructor(suite: string, value: string) {
        this.id = generateRandomGuid();
        this.suite = suite;
        this.value = value;
        this.power = cardValues[value];
        this.imageurl = rootImage + (this.suite.toLowerCase() + "-" + this.value.toLowerCase() + ".png");
        this.cardColor = [ Suits.DIAMOND, Suits.HEART ].indexOf((suite as Suits)) > - 1 ? CardColor.RED : CardColor.BLACK;
    }
}

export const isShowingBack = (card: Card) => card.showBack === true;

export class Deck {
    public deck: Card[] = generateDeckOfCards();
    constructor() { }

    public shuffle = () => {
        this.deck = shuffle(this.deck);
        return this.deck;
    }

    public newDeal = () => {
        this.deck = shuffle(generateDeckOfCards());
        return this.deck;
    }

    public dealCard = () => {
        if (this.deck.length === 0) { return; }
        const [ firstCard, ...rest ] = this.deck;
        this.deck = rest;
        return firstCard;
    }
}

export class Stack<T> {
    public source: T[] = [];

    constructor() { }

    public pop = () => {
        if (this.source.length === 0) { return; }
        const [ first, ...rest ] = this.source.reverse();
        this.source = rest;
        return first;
    }

    public isEmpty = () => {
        return this.source.length === 0;
    }

    public push = item => {
        this.source = [ ...this.source, item ];
    }

    public peek = () => {
        if (this.source.length === 0) { return null; }
        return this.source[this.source.length - 1];
    }

    public removeCardById = id => {
        const cardToGet = (this.source as any).find(c => c.id === id);
        (this.source as any).filter(c => c.id !== id);
        return cardToGet;
    }
}
