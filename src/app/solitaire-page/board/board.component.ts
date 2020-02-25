import { AfterViewInit, Component } from "@angular/core";
import { isNullOrUndefined, isValue } from "utils/Utils";
import { canMoveCardOnBottomPile, Card, CardColor, 
  Deck, isCardNextSmaller, isShowingBack, Stack } from "../solitaireUtils/utils";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements AfterViewInit {
  // Top left pile and accessible card stack
  public dealer: Deck = new Deck();
  public playAbleDrawRow: Stack<Card> = new Stack<Card>();

  // First row that starts with aces and moves down... 
  public TopRow1: Stack<Card> = new Stack<Card>();
  public TopRow2: Stack<Card> = new Stack<Card>();
  public TopRow3: Stack<Card> = new Stack<Card>();
  public TopRow4: Stack<Card> = new Stack<Card>();

  // Bottom row piles
  public BottomRow1: Stack<Card> = new Stack<Card>();
  public BottomRow2: Stack<Card> = new Stack<Card>();
  public BottomRow3: Stack<Card> = new Stack<Card>();
  public BottomRow4: Stack<Card> = new Stack<Card>();
  public BottomRow5: Stack<Card> = new Stack<Card>();
  public BottomRow6: Stack<Card> = new Stack<Card>();
  public BottomRow7: Stack<Card> = new Stack<Card>();

  public CardIsSelected = {
    id: null,
    row: null,
    isRange: null
  };

  public bottomRows = {
    1: () => this.BottomRow1,
    2: () => this.BottomRow2,
    3: () => this.BottomRow3,
    4: () => this.BottomRow4,
    5: () => this.BottomRow5,
    6: () => this.BottomRow6,
    7: () => this.BottomRow7,
    8: () => this.TopRow1,
    9: () => this.TopRow2,
    10: () => this.TopRow3,
    11: () => this.TopRow4,
    12: () => this.playAbleDrawRow
  };

  public handlePlayAbleDrawRow = () => {
    if (!this.dealer.isEmptyDeck()) {
      const cards = [...Array(3).keys()].reduce(
        (acc, cur) => acc.concat(this.dealer.dealCard())
        , []).filter((c: Card) => isValue(c));
      if (isValue(this.playAbleDrawRow.peek())) {
        this.playAbleDrawRow.peek().isSelected = false;
      }
      cards.forEach(c => (c.showFront(), this.playAbleDrawRow.push(c)) );
      // this.playAbleDrawRow.peek().showFront();
    }
  }

  public handlePlayAbleDrawRowWhenEmpty = () => {
    if (this.dealer.isEmptyDeck()) {
      this.dealer.deck = this.playAbleDrawRow.source.map((c: Card) => {
        c.showBackOfCard();
        c.isSelected = false;
        return c;
      });

      this.playAbleDrawRow.source = [];
    }
  }

  public handlePlayAbleCardStack = (card: Card) => {
      if (card.isSelected) {
        card.isSelected = false;
        this.defaultCardIsSelected();
      } else {
        card.isSelected = true;
        this.setCardIsSelected(card.id, 12);
      }
  }

  public destructurePileString = (pile: string): Stack<Card> => {
     const [ _, p2 ] = pile.split("-");
     return p2 in this.bottomRows ? this.bottomRows[p2]() : null;
  }

  public destructureId = (id: string): string => {
    return id.split("+")[1];
  }

  public getCardById = (id: string, source: Card[]): Card => {
    return source.find(c => c.id === id);
  }

  public isValidSet = (set: Card[]): boolean => {
    return set.every((c: Card, idx: number, ar: Card[]) => {
          const nextCard = ar[idx + 1] || null;
          if (isNullOrUndefined(nextCard)) { return true; }
          return c.power > nextCard.power && c.cardColor !== nextCard.cardColor;
    });
  }

  public canBeClicked = (id: string, row: number): boolean => {
    let tempSource;
    return row in this.bottomRows ? (
      tempSource = this.bottomRows[row]().source.findIndex(c => c.id === id),
      tempSource === this.bottomRows[row]().source.length - 1
    ) : false;
  }

  public canBeClickedAndIsNotFirstCard = (id: string, targetRow: number) => {
    const stack: Stack<Card> = targetRow in this.bottomRows ? this.bottomRows[targetRow]() : null;
    if (isNullOrUndefined(stack) || stack.source.length === 1) { return null; }

    const cardIndex = stack.source.findIndex((c: Card) => c.id === id);
    // if it's last card then we don't need to select set... 
    // or if card is showing back
    if (cardIndex === stack.source.length || stack.source[cardIndex].showBack) { return null; }

    // slices correctly when                  // Before I select, must know if set is valid
    const st = stack.source.slice(cardIndex); // .map((c: Card) => (c.isSelected = true, c));
    if (st.length === 1) { return null; }
    if (!this.isValidSet(st)) { return null; }
    st.map((c: Card) => (c.isSelected = true, c));
    return st;
    // const isValidSet
  }

  // tslint:disable-next-line:member-ordering
  public cd = { };

  constructor() {
      this.deal();
  }

  public newDeal = () => {
    const rows = Object.values(this.bottomRows).map(thunk => thunk());

    rows.forEach(stack => {
      stack.source = [];
    });

    this.deal();
  }

  public deal = () => {
    this.dealer.newDeal();

    const bottomRow = [
      this.BottomRow1,
      this.BottomRow2,
      this.BottomRow3,
      this.BottomRow4,
      this.BottomRow5,
      this.BottomRow6,
      this.BottomRow7
    ];

    /*
        Everything that was commented out 
        is only for testing purposes only
    */
    // const ace = this.getCardAndFilterOutOfDeck(14, CardColor.BLACK);
    // const two = this.getCardAndFilterOutOfDeck(2, CardColor.BLACK);
    // const tenRed = this.getCardAndFilterOutOfDeck(10, CardColor.RED);
    // const nineBlack = this.getCardAndFilterOutOfDeck(9, CardColor.BLACK);
    // const eightRed = this.getCardAndFilterOutOfDeck(8, CardColor.RED);
    // const jackBlack = this.getCardAndFilterOutOfDeck(11, CardColor.BLACK);

    // const cardsToAdd = [ tenRed, nineBlack, eightRed ]
    // .map((c: Card) => (c.showFront(), c));

    for (let i = 0; i < 7; i++) {
      bottomRow.slice(i).forEach((pile, idx) => {
          // if (i + idx === 6 && this.bottomRows[7]().source.length > 3) {
          // just pass through... 
          // } else {
          pile.push(this.dealer.dealCard());
          // }
      });
    }

    // bottomRow[6].source = [ ...bottomRow[6].source, ...cardsToAdd ];

    // bottomRow[0].source = [ ace ];
    // bottomRow[2].source = bottomRow[2].source.map((c, idx, arr) => idx === arr.length - 1 ? two : c); 
    // Need to swamp with deck
    bottomRow.forEach(pile => {
      pile.peek().showFront();
    });
  }

  public getCardAndFilterOutOfDeck = (power: Number, color: CardColor): Card => {
      const card = this.dealer.deck.find((c: Card) => c.power === power && c. cardColor === color);
      this.filterOutCardInDeck(card.id);
      return card;
  }

  public filterOutCardInDeck = (id: string): void => {
    this.dealer.deck = this.dealer.deck.filter((c: Card) => c.id !== id);
  }

  ngAfterViewInit() { }

  public defaultCardIsSelected = () => {
    this.CardIsSelected = {
      id: null,
      row: null,
      isRange: null
    };
  }

  public setCardIsSelected = (id, row, isRange = null) => {
    this.CardIsSelected = { id, row, isRange };
  }

  /* 
        Need to write up instructions for game rules on game.
        On procedure on clicking cards for where and to
        Also on wether you can click a card and turn it over

        Need to do some thinking 
        
        Handle click for selecting cards 
  */

  public bottomRowPile = (stack: Stack<Card>) => {
    if (stack.isEmpty() && this.CardIsSelected.isRange) {
        const firstCard = this.CardIsSelected.id[0];
        if (firstCard.power === 13) {
          this.CardIsSelected.id.forEach(c => {
            stack.push(c);
          });
          const st: Stack<Card> = this.bottomRows[this.CardIsSelected.row]();
          st.source = st.source.filter(
            (c: Card) => this.CardIsSelected.id.every((cc: Card) => cc.id !== c.id)
          );
          this.CardIsSelected.id.map((c: Card) => (c.isSelected = false, c));
          this.defaultCardIsSelected();
        }
        return;
    }
    if (stack.isEmpty() && isValue(this.CardIsSelected.id)) {
        const sourceStack: Stack<Card> = this.bottomRows[this.CardIsSelected.row]();
        const sourceCard = sourceStack.source.find(c => c.id === this.CardIsSelected.id);

        if (sourceCard.power === 13) {
            sourceStack.source = sourceStack.source.filter(c => c.id !== this.CardIsSelected.id);
            sourceCard.isSelected = false;
            stack.push(sourceCard);
            this.defaultCardIsSelected();
        }
    }
  }

  // Make sure to pass in card and pile being clicked
  public handleCardClick = (tgCard: Card, tgRow: number) => {
    const targetCard: Card = tgCard;
    const targetRow: number = tgRow;
    const targetStack: Stack<Card> = this.bottomRows[targetRow]();

    const sourceRow: number = this.CardIsSelected.row;

    // Handle click should only be for bottom rows
    if (targetRow > 7) { return; }
    // if (sourceRow > 7) { return; }

    const sourceStack: Stack<Card> = sourceRow 
                                     ? this.bottomRows[sourceRow]() 
                                     : null;

    const sourceCard: Card = sourceStack ? 
                             sourceStack.source.find(c => c.id === this.CardIsSelected.id) 
                             : null;

    if (isValue(this.CardIsSelected.isRange)) {
      // if location is not valid then cards should be unselected
      const firstCard = this.CardIsSelected.id[0];
      if (canMoveCardOnBottomPile(firstCard, targetCard)) {
        // Need to move set to target row...
        const stack: Stack<Card> = this.bottomRows[targetRow]();
        this.CardIsSelected.id.forEach((c: Card) => {
            stack.push(c);
        });

        this.bottomRows[sourceRow]().source = sourceStack.source.filter(
          (c: Card) => this.CardIsSelected.id.every((cc: Card) => cc.id !== c.id));
      } else { }
      this.CardIsSelected.id.map((c: Card) => (c.isSelected = false, c));
      this.defaultCardIsSelected();
      return;
    }

    if (isNullOrUndefined(this.CardIsSelected.id)) {

      // Need to check if it's not the last and if it's not need to select all the cards
      // When all the cards are selected
      // First I should edit existing code to use set to more easily 
      // Add a range of cards... 
      // Deciding to add property to test when card is selected
      // this.canBeClickedAndIsNotFirstCard will check if valid if valid will set and select cards
      // Then will enter the if loop
      const setToBeSelected = this.canBeClickedAndIsNotFirstCard(targetCard.id, targetRow);
      if (isValue(setToBeSelected)) {
          this.setCardIsSelected(setToBeSelected, targetRow, true);
          return;
      }

      // check if it is last card in set
      if (!this.canBeClicked(targetCard.id, targetRow)) {
        return;
      }

      if (this.canBeClicked(targetCard.id, targetRow) && isShowingBack(targetCard)) {
        targetCard.showFront();
        return;
      }

      // Need to know if another card is selected
      if (isValue(this.CardIsSelected.id)) { 
          this.bottomRows[this.CardIsSelected.row]()
          .source
          .find(c => c.id === this.CardIsSelected.id).isSelected = false;
          return;
      }

      if (isValue(this.CardIsSelected.id) && this.CardIsSelected.id === targetCard.id) {
          targetCard.isSelected = false;
          this.defaultCardIsSelected();
          return;
      }

      // Need to be able to click that card and highlight that it's seleced
      // First step get card
      targetCard.isSelected = !targetCard.isSelected;
      this.setCardIsSelected(targetCard.id, targetRow);
    } else if (isValue(this.CardIsSelected.id) && targetCard.id === this.CardIsSelected.id) {
      targetCard.isSelected = !targetCard.isSelected;
      this.defaultCardIsSelected();
    } else if (isValue(this.CardIsSelected.id) && isValue(sourceStack) && canMoveCardOnBottomPile(sourceCard, targetCard)) {
      // Need to push source into target
      // Need to filter out source in sourceStack
      sourceStack.source = sourceStack.source.filter(c => c.id !== sourceCard.id);
      // Need to add source to target

      sourceCard.isSelected = false;
      targetCard.isSelected = false;

      targetStack.push(sourceCard);
      targetStack.source = targetStack.source.map(c => {
        c.isSelected = false;
        return c;
      });
      this.defaultCardIsSelected();
    } else if (isValue(this.CardIsSelected.id) 
    && isValue(sourceStack)
    && this.canAddCardToTopRow(sourceCard, targetStack)) {
      sourceCard.isSelected = false;
      targetCard.isSelected = false;
      sourceStack.source = sourceStack.source.filter(c => c.id !== sourceCard.id);
      targetStack.push(sourceCard);
      // this.removeClick(targetRow);
      this.defaultCardIsSelected();
    } else if (isValue(this.CardIsSelected.id)) {
      targetCard.isSelected = !targetCard.isSelected;
      // now change the previous selected card
      
      const otherCardStack: Stack<Card> = this.bottomRows[this.CardIsSelected.row]();
      const otherCard = otherCardStack.source.find(c => c.id === this.CardIsSelected.id);
      otherCard.isSelected = !otherCard.isSelected;

      this.setCardIsSelected(targetCard.id, targetRow);
    }
    /*
        Need to add check if card can be added to other pile
        if it can card must be 1 less and other opposite color
    */
  }

  public canAddCardToTopRow = (card: Card, stack: Stack<Card>): boolean => {
    if (stack.isEmpty() && card.power !== 14) { return false; }
    return  stack.isEmpty() && card.power === 14    ? true 
            : isCardNextSmaller(card, stack.peek()) ? true
            : false;
  }

  // Need to rewrite logic for this part of the app
  // For some reason when ace is add I can't select another card
  // Again I need to be able to select this card and then unselect this card
  public handleTopRowDestinationClick = row => {
    if (isNullOrUndefined(this.CardIsSelected.id)) {
      const stack: Stack<Card> = this.bottomRows[row]();
      if (!stack.isEmpty()) {
        stack.peek().isSelected = !stack.peek().isSelected;
        this.setCardIsSelected(stack.peek().id, row);
        return;
      }
    }

    if (isValue(this.CardIsSelected.id)) {
      // Need to move selected card to this row...
      // Need to remove card
      const stack: Stack<Card> = this.bottomRows[row]();
      const cards = this.bottomRows[this.CardIsSelected.row]().source;
      const card = cards.find(c => c.id === this.CardIsSelected.id);
      // .removeCardById(this.CardIsSelected.id);
      // Need to check if card can be added to source
      if (this.canAddCardToTopRow(card, stack)) {
        this.bottomRows[this.CardIsSelected.row]().source = cards.filter(c => c.id !== this.CardIsSelected.id); 
        card.isSelected = false;
        this.bottomRows[row]().push(card);
        this.defaultCardIsSelected();
        return;
      }

      // need to get card and check if it's the same as being click
      // if so then toggle the isSelect... 
      if (isValue(stack.peek()) && stack.peek().id === this.CardIsSelected.id) {
        stack.peek().isSelected = !stack.peek().isSelected;
        this.defaultCardIsSelected();
        return;
      }

    } else {
      const stack: Stack<Card> = this.bottomRows[row]();
      // Need to select top most card, and change it's state to isSelected 
      // And populate defaultSelected card
      if (!stack.isEmpty()) {
        stack.peek().isSelected = true;
        this.setCardIsSelected(stack.peek().id, row);
      }
    }
  }
}
