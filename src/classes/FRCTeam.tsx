import type { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import type { FRCMatch } from "./FRCMatch";

const DEFAULT_COLOR = "#383838"

export class FRCTeam {
    private teamName: string;
    private totalRP: number;
    private matchesPlayed: number;
    private numQMs: number;
    private teamColor: string

    constructor(teamName: string, teamColor = DEFAULT_COLOR, totalRP = 0.0, matchesPlayed = 0, numQMs = 0){
        this.teamName = teamName;
        this.totalRP = totalRP;
        this.matchesPlayed = matchesPlayed;
        this.numQMs = numQMs;
        this.teamColor = teamColor;
    }

    getTeamName(){
        return this.teamName;
    }

    setTeamName(teamName: string){
        this.teamName = teamName;
        console.log(this.teamName);
    }

    getTotalRP(){
        return this.totalRP;
    }

    getMatchesPlayed(){
        return this.matchesPlayed;
    }

    addMatchData(matchRP: number){
        this.totalRP += matchRP;
        this.matchesPlayed++;
    }

    getAvgRP(){
        if (this.matchesPlayed === 0.0) return 0.0;
        return this.totalRP/this.matchesPlayed;
    }

    getNumQMs(){
        return this.numQMs;
    }

    incrementNumQMs(){
        this.numQMs++;
    }

    getTeamColor(){
        return this.teamColor;
    }

    /** must be a valid color otherwise the DEFAULT_COLOR will be used*/
    setTeamColor(teamColor: string){
        const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
        if(hexRegex.test(teamColor))
            this.teamColor = teamColor
        else
            teamColor = DEFAULT_COLOR
    }

    /** return average RP of the team when given an array of matches. will only account for matches that have been played */
    getAverageRP(matches: FRCMatch[]): number{
        var totalRP = 0;
        var matchesPlayed = 0;
        matches.forEach((match) =>{
            if(match.getPlayed()){
                if(match.getRed1() === this || match.getRed2() === this || match.getRed3() === this){
                    totalRP += match.getRedRP();
                    matchesPlayed++;
                }
                else if(match.getBlue1() === this || match.getBlue2() === this || match.getBlue3() === this){
                    totalRP += match.getBlueRP();
                    matchesPlayed++;
                }
            }
            console.log("getAverageRP team: " + this.teamName + " totalRP: " + totalRP + " matches played: " + matchesPlayed);
        })
        if(matchesPlayed == 0) return 0;
        return totalRP/matchesPlayed;
    }
    
}

// Firestore data converter
export const TeamConverter = {
    toFirestore: (team: FRCTeam) => {
        return {
            teamName: team.getTeamName(),
            teamColor: team.getTeamColor(),
            totalRP: team.getTotalRP(),
            matchesPlayed: team.getMatchesPlayed(),
            numQMs: team.getNumQMs()
            };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options : SnapshotOptions) => {
        const data = snapshot.data(options);
        if(data)
            return new FRCTeam(data.teamName, data.teamColor, data.totalRP, data.matchesPlayed, data.numQMs);
    },
};

/** returns a team from the array with the matching name */
export function getTeamByName(name: string, teams: FRCTeam[]): FRCTeam{
    console.log("desired name: " + name);
    console.log(teams);

    const foundTeam = teams.find(team => team.getTeamName() === name);
    
    if(foundTeam) return foundTeam;

    console.error("team not found");
    return new FRCTeam("");
}