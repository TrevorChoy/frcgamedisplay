import type { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { blueAllianceColor, redAllianceColor, WinnerState } from "../Constants";
import { FRCAlliance } from "./FRCAlliance";
import { FRCTeam, TeamConverter } from "./FRCTeam";

export class FRCMatch {
    private red1: FRCTeam;
    private red2: FRCTeam;
    private red3: FRCTeam;
    private blue1: FRCTeam;
    private blue2: FRCTeam;
    private blue3: FRCTeam;
    private name: string
    private winnerState: WinnerState;

    constructor(red1: FRCTeam, red2: FRCTeam, red3: FRCTeam, blue1: FRCTeam, blue2: FRCTeam, blue3: FRCTeam, name: string, winnerState = WinnerState.NOTPLAYED){
        this.red1 = red1;
        this.red2 = red2;
        this.red3 = red3;
        this.blue1 = blue1;
        this.blue2 = blue2;
        this.blue3 = blue3;
        this.name = name;
        this.winnerState = winnerState;
    }

    getRed1(){
        return this.red1;
    }
    getRed2(){
        return this.red2;
    }
    getRed3(){
        return this.red3
    }
    getBlue1(){
        return this.blue1;
    }
    getBlue2(){
        return this.blue2;
    }
    getBlue3(){
        return this.blue3;
    }
    getWinnerState(){
        return this.winnerState;
    }  

    getName(){
        return this.name;
    }
    /** @param winnerState the state representing which alliance won. (RED, BLUE, or TIE)  a default value of NOTPLAYED is used for matches not yet played*/
    setWinner(winnerState: WinnerState){
        this.winnerState = winnerState;
    }
    /** red if red won, blue if blue won and gray if tie or not played yet 
     * @return the color representative of the winner of the match in hex
    */
    getColor(){
        return this.winnerState.color;
    }

    /** returns a new Alliance object(no points just red alliance teams and color) */
    getRedAlliance(){
        return new FRCAlliance(redAllianceColor, this.red1, this.red2, this.red3);
    }

    /** returns a new Alliance object(no points just blue alliance teams and color) */
    getBlueAlliance(){
        return new FRCAlliance(blueAllianceColor, this.blue1, this.blue2, this.blue3);
    }
}

// Firestore data converter
export const MatchConverter = {
    toFirestore: (match: FRCMatch) => {
        return {
            red1: TeamConverter.toFirestore(match.getRed1()),
            red2: TeamConverter.toFirestore(match.getRed2()),
            red3: TeamConverter.toFirestore(match.getRed3()),
            blue1: TeamConverter.toFirestore(match.getBlue1()),
            blue2: TeamConverter.toFirestore(match.getBlue2()),
            blue3: TeamConverter.toFirestore(match.getBlue3()),
            name: match.getName(),
            winnerState: match.getWinnerState(),
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options : SnapshotOptions) => {
        const matchData = snapshot.data(options);
        if(matchData)
            return new FRCMatch(
                new FRCTeam(matchData.red1.teamName, matchData.red1.teamColor, matchData.red1.totalRP, matchData.red1.matchesPlayed, matchData.red1.numQMs), 
                new FRCTeam(matchData.red2.teamName, matchData.red2.teamColor, matchData.red2.totalRP, matchData.red2.matchesPlayed, matchData.red2.numQMs), 
                new FRCTeam(matchData.red3.teamName, matchData.red3.teamColor, matchData.red3.totalRP, matchData.red3.matchesPlayed, matchData.red3.numQMs), 
                new FRCTeam(matchData.blue1.teamName, matchData.blue1.teamColor, matchData.blue1.totalRP, matchData.blue1.matchesPlayed, matchData.blue1.numQMs), 
                new FRCTeam(matchData.blue2.teamName, matchData.blue2.teamColor, matchData.blue2.totalRP, matchData.blue2.matchesPlayed, matchData.blue2.numQMs), 
                new FRCTeam(matchData.blue3.teamName, matchData.blue3.teamColor, matchData.blue3.totalRP, matchData.blue3.matchesPlayed, matchData.blue3.numQMs), 
                matchData.name, 
                matchData.winnerState);
    }
};