export const CURRENTMATCHREFNAME = "currentMatchData"

/** the amount of time in seconds of auto period */
export const AUTOLENGTH = 5//20;
/** the amount of time in seconds of pause period between auto and teleop*/
export const PAUSELENGTH = 1;
/** the amount of time in seconds of teleop period */
export const TELEOPLENGTH = 5 //135;
/** the time on the clock when endgame starts */
export const ENDGAMETIME = 30

export const energizedRPMinFuels = 100;
export const superchargedRPMinFuels = 360;
export const traversalMinClimbPoints = 50;

export const NOCLIMBPOINTS = 0;
export const L1AUTOCLIMBPOINTS = 15;
export const L1CLIMBPOINTS = 10;
export const L2CLIMBPOINTS = 20;
export const L3CLIMBPOINTS = 30;

//I hope you were right google AI
export const FOULPOINTS = 2;
export const TECHFOULPOINTS = 6;

export const DisplayState = {
    SETUP: "SETUP",
    ENTERNEWID: "ENTERNEWID",
    ENTEROLDID: "ENTEROLDID",
    NEWGAMESETUP: "NEWGAMESETUP",
    DISPLAYQMS: "DISPLAYQMS",
    RUNMATCH: "RUNMATCH",
    FINISHMATCH: "FINISHMATCH"
} as const;

export type DisplayState = typeof DisplayState[keyof typeof DisplayState];

export const MatchState = {
    IDLE: "IDLE",
    AUTO: "AUTO",
    PAUSE: "PAUSE",
    TELEOP: "TELEOP",
    FINISHED: "FINISHED"
} as const;

export type MatchState = typeof MatchState[keyof typeof MatchState];


export const redAllianceColor = "#a32020";
export const blueAllianceColor = "#2040a3"

export enum WinnerState {
    NOTPLAYED = "notplayed",
    RED = "red",
    BLUE = "blue",
    TIE = "tie"
}

// Define the color mapping for each state (make sure this matches what you're expecting)
export const winnerStateColors = {
    [WinnerState.NOTPLAYED]: { color: "#474747" },  // Default color
    [WinnerState.RED]: { color: redAllianceColor},
    [WinnerState.BLUE]: { color: blueAllianceColor },
    [WinnerState.TIE]: { color: "#808080" },
};


