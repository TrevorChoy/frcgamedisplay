export const CURRENTMATCHREFNAME = "currentMatchData"

/** the amount of time in seconds of auto period */
export const AUTOLENGTH = 20;
/** the amount of time in seconds of pause period between auto and teleop*/
export const PAUSELENGTH = 1;
/** the amount of time in seconds of teleop period */
export const TELEOPLENGTH = 135;
/** the time on the clock when endgame starts */
export const ENDGAMETIME = 30

export const energizedRPMinFuels = 100;
export const superchargedRPMinFuels = 360;
export const traversalMinClimbPoints = 50;

export const DisplayState = {
    SETUP: "SETUP",
    NEWGAMESETUP: "NEWGAMESETUP",
    DISPLAYQMS: "DISPLAYQMS",
    MATCH: "MATCH"
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

export const ClimbState = {
    NOCLIMB: {points: 0},
    AUTOL1: {points: 15},
    L1: {points: 10},
    L2: {points: 20},
    L3: {points: 30}
} as const;

export type ClimbState = typeof ClimbState[keyof typeof ClimbState];

export const redAllianceColor = "#a32020";
export const blueAllianceColor = "#2040a3"

export const WinnerState = {
    NOTPLAYED: {color: "#474747"},
    RED: {color: redAllianceColor},
    BLUE: {color: blueAllianceColor},
    TIE: {color: "#474747"}
} as const;

export type WinnerState = typeof WinnerState[keyof typeof WinnerState];

