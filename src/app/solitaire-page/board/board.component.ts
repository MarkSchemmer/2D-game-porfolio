import { AfterViewInit, Component } from "@angular/core";
import * as $ from "jquery";
import { Card, Deck, Stack } from "../solitaireUtils/utils";

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

  public bottomRos = {
    1: () => this.BottomRow1,
    2: () => this.BottomRow2,
    3: () => this.BottomRow3,
    4: () => this.BottomRow4,
    5: () => this.BottomRow5,
    6: () => this.BottomRow6,
    7: () => this.BottomRow7
  };

  public destructurePileString = (pile: string): Stack<Card> => {
     const [, p2 ] = pile.split("-");
     console.log(p2);
     return p2 in this.bottomRos ? this.bottomRos[p2]() : null;
  }

  public gettingCardById = (id: string, source: Card[]): Card => {
    return source.find(c => c.id === id);
  }

  // tslint:disable-next-line:member-ordering
  public cd = { };

  constructor() {
      this.deal();
      console.log(this.BottomRow1.source);
   }

  ngAfterViewInit() {
    // need to make a deal when starting out on this which will deal to the board
    // first let's setup the board and view then 
    [ ...$(".card img") ].forEach(ele => {
      ele.addEventListener("click", (event) => {
        console.log($(event.target).attr("class"));
        const [pile, id] = $(event.target).attr("class").split(" ");
        console.log(this.destructurePileString(pile));
      });
    });
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
  }

  public getSource = st => {
    return st.source;
  }

}
