import { Component, Input, OnInit } from "@angular/core";
import { R } from "schemas/rType";
import { MoveHistory } from "schemas/tic-tac-toe-page/square.schema";

@Component({
  selector: "app-step-history",
  templateUrl: "./step-history.component.html",
  styleUrls: [ "./step-history.component.scss" ]
})
export class StepHistoryComponent implements OnInit {

  @Input() board: R<MoveHistory[]> = null;
  @Input() handleStepHistClick: any;
  constructor() { }

  ngOnInit() { }

}
