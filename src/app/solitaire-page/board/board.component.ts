import { AfterViewInit, Component } from "@angular/core";
import * as $ from "jquery";
import { Card, Deck, Stack } from "../solitaireUtils/utils";
import { isValue } from 'utils/Utils';

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

  public dealer: Deck = new Deck();

  // First row that starts with aces and moves down... 
  public TopRow1: Stack<Card> = new Stack<Card>();
  public TopRow2: Stack<Card> = new Stack<Card>();
  public TopRow3: Stack<Card> = new Stack<Card>();
  public TopRow4: Stack<Card> = new Stack<Card>();

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
    11: () => this.TopRow4
  };

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

  // tslint:disable-next-line:member-ordering
  public cd = { };

  constructor() {
      this.deal();
   }

  ngAfterViewInit() {
    // need to make a deal when starting out on this which will deal to the board
    // first let's setup the board and view then 
    console.log([...$(".card img")].length);
    [ ...$(".card img") ].forEach(ele => {
      ele.addEventListener("click", this.handleCardClick);
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
      console.log(newPile.source);
      const newId = this.destructureId(id);
      return this.getCardById(newId, newPile.source);
  }

  public getRow = event => {
    const [pile, id] = $(event.target).attr("class").split(" ");
    return pile.split("-")[1];
  }

  /* 
  
  Need to write up instructions for game rules on game.
  On procedure on clicking cards for where and to
  Also on wether you can click a card and turn it over

  Need to do some thinking 
  
    Handle click for selecting cards 
    
    if this is the card 
  */

  public handleCardClick = event => {
    const card = this.getCard(event);
    const row = +(this.getRow(event));
    // Need to know if another card is selected
    if (isValue(this.CardIsSelected.id)) { 
        this.bottomRows[this.CardIsSelected.row]()
        .source
        .find(c => c.id === this.CardIsSelected.id).isSelected = false;
    }

    if (isValue(this.CardIsSelected.id) && this.CardIsSelected.id === card.id) {
        card.isSelected = false;
        this.defaultCardIsSelected();
        return;
    }

    // Need to be able to click that card and highlight that it's seleced
    // First step get card
    card.isSelected = !card.isSelected;
    this.setCardIsSelected(card.id, row);
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

    for (let i = 0; i < 7; i++) {
      bottomRow.slice(i).forEach(pile => {
          pile.push(this.dealer.dealCard());
      });
    }

    bottomRow.forEach(pile => {
      pile.peek().showFront();
    });

    // console.log(bottomRow);

    this.TopRow1.push(this.BottomRow1.pop());
  }

  public getSource = st => {
    return st.source;
  }

  public handleClick = () => alert("test me");

}
