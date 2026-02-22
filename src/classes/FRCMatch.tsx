import type { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { blueAllianceColor, redAllianceColor, WinnerState, winnerStateColors } from "../Constants";
import { AllianceConverter, FRCAlliance } from "./FRCAlliance";
import { FRCTeam, TeamConverter } from "./FRCTeam";

export class FRCMatch {
    private redAlliance: FRCAlliance;
    private blueAlliance: FRCAlliance;
    private name: string;
    private played: boolean;

    constructor(redAlliance: FRCAlliance, blueAlliance: FRCAlliance, name: string, played = false){
        this.redAlliance = redAlliance;
        this.blueAlliance = blueAlliance;
        this.name = name;
        this.played = played;
    }

    getRed1(){
        if(this.redAlliance === undefined) console.log("red alliance undefined");
        return this.redAlliance.getTeam1();
    }
    getRed2(){
        return this.redAlliance.getTeam2();
    }
    getRed3(){
        return this.redAlliance.getTeam3();
    }
    getBlue1(){
        return this.blueAlliance.getTeam1();
    }
    getBlue2(){
        return this.blueAlliance.getTeam2();
    }
    getBlue3(){
        return this.blueAlliance.getTeam3();
    }

    getName(){
        return this.name;
    }

    getWinnerState(): WinnerState{
        if(!this.played) return WinnerState.NOTPLAYED;
        if(this.redAlliance.getTotalPoints() > this.blueAlliance.getTotalPoints())
            return WinnerState.RED;
        else if(this.blueAlliance.getTotalPoints() > this.redAlliance.getTotalPoints())
            return WinnerState.BLUE;
        else
            return WinnerState.TIE;
    }

    getRedRP(){
        var winRPs = 0;
        if(this.getWinnerState() === WinnerState.RED) winRPs = 3;
        else if(this.getWinnerState() === WinnerState.TIE) winRPs = 1;
        return (this.redAlliance.getEnergizedRP() ? 1 : 0)
          + (this.redAlliance.getSuperchargedRP() ? 1 : 0)
          + (this.redAlliance.getTraversalRP() ? 1 : 0)
          + winRPs
    }

    getBlueRP(){
        var winRPs = 0;
        if(this.getWinnerState() === WinnerState.BLUE) winRPs = 3;
        else if(this.getWinnerState() === WinnerState.TIE) winRPs = 1;
        return (this.blueAlliance.getEnergizedRP() ? 1 : 0)
          + (this.blueAlliance.getSuperchargedRP() ? 1 : 0)
          + (this.blueAlliance.getTraversalRP() ? 1 : 0)
          + winRPs
    }

    /** red if red won, blue if blue won and gray if tie or not played yet 
     * @return the color representative of the winner of the match in hex
    */
    getColor() : string{
        return winnerStateColors[this.getWinnerState()].color;
    }

    getRedAlliance(){
        return this.redAlliance;
    }

    getBlueAlliance(){
        return this.blueAlliance;
    }

    withRedAlliance(redAlliance: FRCAlliance){
        const newMatch = new FRCMatch(redAlliance, this.blueAlliance, this.name, this.played);
        return newMatch;
    }

    withBlueAlliance(blueAlliance: FRCAlliance){
        const newMatch = new FRCMatch(this.redAlliance, blueAlliance, this.name, this.played);
        return newMatch;
    }

    getPlayed(){
        return this.played;
    }

    setPlayed(played: boolean){
        this.played = played;
    }
}

// Firestore data converter
export const MatchConverter = {
    toFirestore: (match: FRCMatch) => {
        return {
            redAlliance: AllianceConverter.toFirestore(match.getRedAlliance()),
            blueAlliance: AllianceConverter.toFirestore(match.getBlueAlliance()),
            played: match.getPlayed(),
        };
    },
};