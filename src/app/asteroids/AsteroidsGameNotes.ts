
/*
    Game notes for Asteroids game

    Completed: 
    - Have game board setup with proper styles
    - Have base files for physics library 
    - Utility file setup for game as well
    - 1. Need to investiage ticker or primitive engine I'm going to use
    - 1.1 Get function for initiating board ready on ngOnInit() 
    - 2. Take notes and start fucntion to implement
    - 3. Create structure of how I'm going to update and render movement and characters 
    -> Notes 
    -> Then create dummy functions to achieve this
    - 4. Create Ship class which will have all important information and things my ship can do
    - 5. refactor ship.ts, clean up ship.ts class and clean up Point class, add Interface as well... 
    - 6. Refactor handle key up and key down to use constants
        * Makes it easier to add keys and to understand what is being changed... 
    - 7. Add pause play sign to show whether game is paused or it's active 
        -> Need to shrink the board and center it
    - 9. Investigate some sort of model which slowly starts and stops like a space ship
    - 10. Determine what happens when ship crosses border -> it should appear on the opposite side... 
        -> right now ship will not be able to cross border

    Shelved: 
    - 8. Activly change width and height of game baord update all entities that's needed
        -> Not going to implement this, going to stick to a 800 x 800 box... 

    Todo:  
    - 11. Need to create white stream of light to trial behind ship to show some sort of ship path.
    - 12. Need to give my ship an entire face lift... Draw a new ship and also give a nice engine light. 

    *********************** Architecture notes ********************************
    Notes for Game Object: 
    
    Why is Game-Object needed? 
    A game object will allow us to update game pieces and track progression during game

    Some Capabilities of GameObject: 

    Need a game Object, which will contain level, scores, players, ect... 
    When a new level is needed or restart we assign gameObject to it's original 

    Flow of Game (Scenes): 
    To be determined... 
    ***************************************************************************

    ***************************** Coding Notes ********************************
    Getting full dimensions of element:
    - docuemnt.getElementById("item").offsetWidth or .offsetHeight
    ***************************************************************************

    **** Old coding snippets removed and could be used again possible *********

                if (this.whichAngleIsMore.direction === "none") {
            this.whichAngleIsMore.direction = "right";
            this.whichAngleIsMore.count++;
        } else if (this.whichAngleIsMore.direction === "right") {
            this.whichAngleIsMore.count++;
        } else if (this.whichAngleIsMore.direction === "left" && this.whichAngleIsMore.count > 0) {
            this.whichAngleIsMore.count--;
            if (this.whichAngleIsMore.count === 0) {
                this.whichAngleIsMore.direction = "none";
            }
        } else {
            this.whichAngleIsMore.direction = "right";
            this.whichAngleIsMore.count++;
        } 

        console.log(this.whichAngleIsMore);

            // For moment not going to implement this function
        // Just going to prevent ship from leaving board
        public DidShipCrossCanvasBorder = () => {
            // const x = this.shipCenterPoint.x, y = this.shipCenterPoint.y;
            // console.log("x: ", x);
            // console.log("y: ", y);p
            // console.log(`x: ${x}, y: ${y}`);
            // if (y < 0 || y > 800) {
            //     // Need to translate ship to bottom of board
            //     // this.rotate(-Math.PI / 2);
            //     // this.ctx.save();
            //     // console.log("I have crossed Cieling border: ");
            //     // this.draw();
            //     // const xx = x > 700 ? Math.abs((1200 - x) - x) : 0;
            //     // console.log(-800);
            //     this.translate(
            //        -800, 0
            //     );
            //     return;
            // }

            // if (x < 0 || x > 800) {
            //     this.translate(-800, -100);
            //     return;
            // }
        }

    ***************************************************************************
*/
