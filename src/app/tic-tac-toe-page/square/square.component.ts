import { Component, Input, OnInit } from "@angular/core";
import { isValue } from "utils/Utils";

@Component({
  selector: "app-square",
  templateUrl: "./square.component.html",
  styleUrls: ["./square.component.scss"]
})
export class SquareComponent implements OnInit {

  @Input() square: string;

  @Input() handleSquareClick: any;

  constructor() { }

  ngOnInit() {
    this.square = isValue(this.square) ? this.square : null;
  }

}
