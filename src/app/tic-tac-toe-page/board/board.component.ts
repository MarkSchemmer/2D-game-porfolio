import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {

  squares = new Array(9).fill(0).map((i, idx) => idx);

  constructor() { }

  ngOnInit() {
  }

}
