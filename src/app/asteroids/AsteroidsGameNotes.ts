
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
    - 13. Need to refactor calcForce() and calcForceDecrease() to become and remove the if else statement

    Shelved: 
    - 8. Activly change width and height of game baord update all entities that's needed
        -> Not going to implement this, going to stick to a 800 x 800 box... 
    - 12. Need to give my ship an entire face lift... Draw a new ship and also give a nice engine light. 

    Todo Today:  
    - 12. Create ability for ship to fire, when spacebar is hit, ship will fire... and flow a cross 
          screen and then disappear 
          - Ship can fire -> done
          - Need to know when ship bullets cross border and should be removed... 
          - Need to slow down rate of fire... So track frames so ship can only fire every 100 frames per say
    - 14. Complete readme.md page so information is public and can be reviewded by other people and recruiters
    Todo on stack: 
    - 11. Need to create white stream of light to trial behind ship to show some sort of ship path.

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
    ***************************************************************************
*/
