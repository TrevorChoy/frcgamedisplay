import { blueAllianceColor, ClimbState, energizedRPMinFuels, redAllianceColor, superchargedRPMinFuels, traversalMinClimbPoints } from "../Constants";
import type { FRCGame } from "./FRCGame";
import { MatchConverter } from "./FRCMatch";
import { TeamConverter, type FRCTeam } from "./FRCTeam";

export class FRCAlliance{
    //alliance color
    private readonly color: string

    //teams on the alliance
    private readonly team1: FRCTeam;
    private readonly team2: FRCTeam;
    private readonly team3: FRCTeam;

    //points
    private readonly autoFuels: number;
    private readonly autoClimbState: ClimbState;
    private readonly teleopFuels: number;
    private readonly endgameClimbState: ClimbState;
    private readonly fouls: number;
    private readonly techFouls: number;


    constructor(
        color: string,
        team1: FRCTeam, 
        team2: FRCTeam, 
        team3: FRCTeam,
        autoFuels = 0,
        autoClimbState:ClimbState = ClimbState.NOCLIMB,
        teleopFuels = 0,
        endgameClimbState:ClimbState = ClimbState.NOCLIMB,
        fouls = 0,
        techFouls = 0){
            this.color = color
            this.team1 = team1;
            this.team2 = team2;
            this.team3 = team3;
            this.autoFuels = autoFuels;
            this.autoClimbState = autoClimbState;
            this.teleopFuels = teleopFuels;
            this.endgameClimbState = endgameClimbState;
            this.fouls = fouls;
            this.techFouls = techFouls;
    }

    getColor(){
        return this.color;
    }

    getTeam1(){
        return this.team1;
    }

    getTeam2(){
        return this.team2;
    }

    getTeam3(){
        return this.team3;
    }

    withNewData(
        autoFuels = 0,
        autoClimbState:ClimbState = ClimbState.NOCLIMB,
        teleopFuels = 0,
        endgameClimbState:ClimbState = ClimbState.NOCLIMB,
        fouls = 0,
        techFouls = 0){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                autoFuels,
                autoClimbState,
                teleopFuels,
                endgameClimbState,
                fouls,
                techFouls);
            return newAlliance;
    }

    getAutoFuels(){
        return this.autoFuels;
    }

    getAutoClimbState(){
        return this.autoClimbState;
    }

    getTeleopFuels(){
        return this.teleopFuels;
    }

    getEndgameClimbState(){
        return this.endgameClimbState;
    }

    getFouls(){
        return this.fouls;
    }

    getTechFouls(){
        return this.techFouls;
    }

    getTotalPoints(){
        return this.autoFuels 
             + this.autoClimbState.points
             + this.teleopFuels
             + this.endgameClimbState.points
             - this.fouls
             - this.techFouls;
    }

    getEnergizedRP() : boolean{
        return this.autoFuels + this.teleopFuels > energizedRPMinFuels;
    }

    getSuperchargedRP() : boolean{
        return this.autoFuels + this.teleopFuels > superchargedRPMinFuels;
    }

    getTraversalRP() : boolean{
        return this.endgameClimbState.points + this.autoClimbState.points > traversalMinClimbPoints;
    }
}