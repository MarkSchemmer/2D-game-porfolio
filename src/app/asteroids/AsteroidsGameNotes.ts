
/*
    Game notes for Asteroids game

    Completed: 

    - Have game board setup with proper styles
    - Have base files for physics library 
    - Utility file setup for game as well

    Todo: 

    - 1. Need to investiage ticker or primitive engine I'm going to use
    - 1.1 Get function for initiating board ready on ngOnInit() 
    - 2. Take notes and start fucntion to implement
    - 3. Create structure of how I'm going to update and render movement and characters 
        -> Notes 
        -> Then create dummy functions to achieve this
    - 4. Create Ship class which will have all important information and things my ship can do

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
    
    --------------------------------------------------------------------------

    ***************************** Coding Notes ********************************
    Getting full dimensions of element:
    - docuemnt.getElementById("item").offsetWidth or .offsetHeight
    ***************************************************************************
*/
