import type { DocumentData } from "firebase/firestore";
import type { FRCGame } from "./FRCGame";
import { MatchConverter } from "./FRCMatch";
import { FRCTeam, getTeamByName, TeamConverter } from "./FRCTeam";
import {energizedRPMinFuels, FOULPOINTS, superchargedRPMinFuels, TECHFOULPOINTS, traversalMinClimbPoints } from "../Constants";

export class FRCAlliance{
    //alliance color
    private readonly color: string

    //teams on the alliance
    private readonly team1: FRCTeam;
    private readonly team2: FRCTeam;
    private readonly team3: FRCTeam;

    //points
    private readonly autoFuels: number;
    private readonly autoClimbPoints: number;
    private readonly teleopFuels: number;
    private readonly endgameClimbPoints: number;
    //represents the fouls and tech fouls from the other alliance
    private readonly fouls: number;
    private readonly techFouls: number;

    constructor(
        color: string,
        team1: FRCTeam, 
        team2: FRCTeam, 
        team3: FRCTeam,
        autoFuels = 0,
        autoClimbPoints = 0,
        teleopFuels = 0,
        endgameClimbPoints = 0,
        fouls = 0,
        techFouls = 0){
            this.color = color
            this.team1 = team1;
            this.team2 = team2;
            this.team3 = team3;
            this.autoFuels = autoFuels;
            this.autoClimbPoints = autoClimbPoints;
            this.teleopFuels = teleopFuels;
            this.endgameClimbPoints = endgameClimbPoints;
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

    withAutoFuels(
        autoFuels = this.autoFuels,){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                autoFuels,
                this.autoClimbPoints,
                this.teleopFuels,
                this.endgameClimbPoints,
                this.fouls,
                this.techFouls);
            return newAlliance;
    }

    withAutoClimbPoints(
        autoClimbPoints = this.autoClimbPoints,){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                this.autoFuels,
                autoClimbPoints,
                this.teleopFuels,
                this.endgameClimbPoints,
                this.fouls,
                this.techFouls);
            return newAlliance;
    }

    withTeleopFuels(
        teleopFuels = this.teleopFuels,){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                this.autoFuels,
                this.autoClimbPoints,
                teleopFuels,
                this.endgameClimbPoints,
                this.fouls,
                this.techFouls);
                return newAlliance;
    }

    withEndgameClimbPoints(
        endgameClimbPoints = this.endgameClimbPoints,){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                this.autoFuels,
                this.autoClimbPoints,
                this.teleopFuels,
                endgameClimbPoints,
                this.fouls,
                this.techFouls);
            return newAlliance;
    }

    withFouls(
        fouls = this.fouls,){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                this.autoFuels,
                this.autoClimbPoints,
                this.teleopFuels,
                this.endgameClimbPoints,
                fouls,
                this.techFouls);
            return newAlliance;
    }

    withTechFouls(
        techFouls = this.techFouls,){
            const newAlliance = new FRCAlliance(
                this.color,
                this.team1, 
                this.team2,
                this.team3,
                this.autoFuels,
                this.autoClimbPoints,
                this.teleopFuels,
                this.endgameClimbPoints,
                this.fouls,
                techFouls);
            return newAlliance;
    }

    getAutoFuels(){
        return this.autoFuels;
    }

    getAutoClimbPoints(){
        return this.autoClimbPoints;
    }

    getTeleopFuels(){
        return this.teleopFuels;
    }

    getEndgameClimbPoints(){
        return this.endgameClimbPoints;
    }

    getFouls(){
        return this.fouls;
    }

    getTechFouls(){
        return this.techFouls;
    }

    getTotalPoints(){
        return this.autoFuels 
             + this.autoClimbPoints
             + this.teleopFuels
             + this.endgameClimbPoints
             + this.fouls * FOULPOINTS
             + this.techFouls * TECHFOULPOINTS;
    }

    getEnergizedRP() : boolean{
        return this.autoFuels + this.teleopFuels >= energizedRPMinFuels;
    }

    getSuperchargedRP() : boolean{
        return this.autoFuels + this.teleopFuels >= superchargedRPMinFuels;
    }

    getTraversalRP() : boolean{
        return this.endgameClimbPoints + this.autoClimbPoints >= traversalMinClimbPoints;
    }
}

// Firestore data converter
export const AllianceConverter = {
    toFirestore: (alliance: FRCAlliance) => {
        return {
            color: alliance.getColor(),
            team1Name: alliance.getTeam1().getTeamName(),
            team2Name: alliance.getTeam2().getTeamName(),
            team3Name: alliance.getTeam3().getTeamName(),
            autoFuels: alliance.getAutoFuels(),
            autoClimbPoints: alliance.getAutoClimbPoints(),
            teleopFuels: alliance.getTeleopFuels(),
            endgameClimbPoints: alliance.getEndgameClimbPoints(),
            fouls: alliance.getFouls(),
            techFouls: alliance.getTechFouls()
        };
    },
    fromFirestore: (data: DocumentData, teams: FRCTeam[]) => {
        if(!data) console.error("data does not exist, cannot make a new FRC Alliance");
        
        return new FRCAlliance(
            data.color,
            getTeamByName(data.team1Name,teams),
            getTeamByName(data.team2Name,teams),
            getTeamByName(data.team3Name,teams),
            data.autoFuels, 
            data.autoClimbPoints,
            data.teleopFuels,
            data.endgameClimbPoints,
            data.fouls, 
            data.techFouls);
    }
};