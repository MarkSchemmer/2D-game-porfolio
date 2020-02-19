import { Component, Input, OnInit } from "@angular/core";
import { Card } from "../solitaireUtils/utils";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: [ "./card.component.scss" ]
})
export class CardComponent implements OnInit {
  @Input() pileNumber: number;
  @Input() card: Card;

  constructor() { }

  ngOnInit() { }

}
