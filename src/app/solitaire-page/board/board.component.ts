import { AfterViewInit, Component } from "@angular/core";
import * as $ from "jquery";
import { isNullOrUndefined, isValue } from "utils/Utils";
import { canMoveCardOnBottomPile, Card, Deck, 
  isCardNextSmaller, isShowingBack, Stack } from "../solitaireUtils/utils";

/*

    [ ...$(".card img") ].forEach(ele => {
      ele.addEventListener("click", (event) => {
        console.log($(event.target).attr("class"));
        // tslint:disable-next-line
        const [ pile, id ] = $(event.target).attr("class").split(" ");
        const newPile = this.destructurePileString(pile);
        console.log(newPile);
        const newId = this.destructureId(id);
        console.log(newId);
        const newSource = this.gettingCardById(newId, newPile.source);
        console.log(newSource);
      });
    });

*/

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
    row: null
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
      const card = this.dealer.dealCard();
      card.showFront();
      this.playAbleDrawRow.push(card);
    }
  }

  public handlePlayAbleDrawRowWhenEmpty = () => {
    if (this.dealer.isEmptyDeck()) {
      this.dealer.deck = this.playAbleDrawRow.source.map((c: Card) => {
        c.showBackOfCard();
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

  public canBeClicked = (id: string, row: number) => {
    let tempSource;
    return row in this.bottomRows ? (
      tempSource = this.bottomRows[row]().source.findIndex(c => c.id === id),
      tempSource === this.bottomRows[row]().source.length - 1
    ) : false;
  }

  // tslint:disable-next-line:member-ordering
  public cd = { };

  constructor() {
      this.deal();
   }

  ngAfterViewInit() {
    // need to make a deal when starting out on this which will deal to the board
    // first let's setup the board and view then 
    this.addClickToCards();
  }

  public addClickToCards = () => {
    [ ...$(".card img") ].forEach(ele => {
      ele.addEventListener("click", this.handleCardClick);
    });
  }

  public removeClick = col => {
    [ ...$("column" + col + " img") ].forEach(ele => {
        ele.removeEventListener("click", this.handleCardClick);
    });
  }

  public defaultCardIsSelected = () => {
    this.CardIsSelected = {
      id: null,
      row: null
    };
  }

  public setCardIsSelected = (id, row) => {
    this.CardIsSelected = { id, row };
  }

  public getCard = event => {
      const [pile, id] = $(event.target).attr("class").split(" ");
      const newPile = this.destructurePileString(pile);
      const newId = this.destructureId(id);
      return this.getCardById(newId, newPile.source);
  }

  public getRow = event => {
    const [pile, id] = $(event.target).attr("class").split(" ");
    return pile.split("-")[1];
  }

  public getId = event => {
    const [pile, id] = $(event.target).attr("class").split(" ");
    return this.destructureId(id);
  }

  /* 
        Need to write up instructions for game rules on game.
        On procedure on clicking cards for where and to
        Also on wether you can click a card and turn it over

        Need to do some thinking 
        
        Handle click for selecting cards 
  */

  public bottomRowPile = (stack: Stack<Card>) => {
    console.log("Bottom Pile click event");
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

    this.addClickToCards();
  }

  public handleCardClick = event => {
    console.log("handleCardClick: ");
    const targetCard: Card = this.getCard(event);
    const targetRow: number = +(this.getRow(event));
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

    if (isNullOrUndefined(this.CardIsSelected.id)) {
      // check if it is last card in set
      if (isValue(this.getId(event)) && !this.canBeClicked(this.getId(event), targetRow)) {
        return;
      }

      if (isValue(this.getId(event)) && this.canBeClicked(this.getId(event), targetRow) && isShowingBack(targetCard)) {
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
    this.addClickToCards();
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

    const aceIndex = this.dealer.deck.findIndex(c => c.power === 14);
    const ace = this.dealer.deck[aceIndex];

    const twoIndex = this.dealer.deck.findIndex(c => c.power === 2 && c.suite === ace.suite);
    const two = this.dealer.deck[twoIndex];

    this.dealer.deck = this.dealer.deck.filter((c, idx) => [aceIndex, twoIndex].indexOf(idx) === -1 );

    for (let i = 0; i < 7; i++) {
      bottomRow.slice(i).forEach(pile => {
          pile.push(this.dealer.dealCard());
      });
    }

    bottomRow[0].source = [ ace ];
    bottomRow[2].source = bottomRow[2].source.map((c, idx, arr) => idx === arr.length - 1 ? two : c); 
    bottomRow.forEach(pile => {
      pile.peek().showFront();
    });
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

    // console.log(this.CardIsSelected);
    // console.log(row);
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

    this.addClickToCards();
  }
}
