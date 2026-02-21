import type { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { FRCMatch, MatchConverter } from "./FRCMatch";
import { FRCTeam, TeamConverter } from "./FRCTeam"

export class FRCGame{
    private teams: FRCTeam[];
    private qmMatches: FRCMatch[];
    private numQMs: number;
    private currentQM: number;

    constructor(teams?: FRCTeam[], qmMatches?: FRCMatch[], numQMs?: number, currentQM = 1){
        console.log("frcgame constructor");
        if(teams !== undefined)
            this.teams = teams;
        else
            this.teams = []
        if(qmMatches !== undefined)
            this.qmMatches = qmMatches;
        else
            this.qmMatches = []
        if(numQMs !== undefined)
            this.numQMs = numQMs;
        else
            this.numQMs = 0;

        this.currentQM = currentQM;
    }

    withTestTeams(){
        const newGame = new FRCGame([], this.qmMatches, this.numQMs);
        newGame.teams = [...this.teams, 
            new FRCTeam("CardinalBotics", "#690000"),
            new FRCTeam("Highlander Robotics", "#510485"),
            new FRCTeam("#1 Sea Bass", "#995406"),
            new FRCTeam("test team 1", "#1c7011"),
            new FRCTeam("test team 2", "#1f876f"),
            new FRCTeam("test team 3", "#1e0c78"),
            new FRCTeam("test team 4", "#a8a113"),
            new FRCTeam("test team 5", "#7a0c7a")];
        return newGame;
    }

    /** returns a new FRCTeam object (thanks alot react) with the new team added if the team name is blank returns the current game*/
    withTeam(team: FRCTeam): FRCGame {
        if(team.getTeamName() === "") return this;
        const newGame = new FRCGame([], this.qmMatches, this.numQMs);
        newGame.teams = [...this.teams, team];
        return newGame;
    }

    /** returns a new FRCTeam object (thanks alot react) with the specified team removed(if it exists) */
    withTeamRemovedAtIndex(index: number): FRCGame{
        const newGame = new FRCGame([], this.qmMatches, this.numQMs);
        newGame.teams = this.teams.filter((_, i) => i !== index);
        console.log("new game: " + newGame.getTeams());
        return newGame;
    }

    /** returns a new FRCTeam object with the desired qm matches
     * @param qmMatches the qualification matches to be used in the game
     */
    withQMMatches(qmMatches: FRCMatch[]){
        const newGame = new FRCGame(this.teams, [], this.numQMs);
        newGame.qmMatches = qmMatches;
        return newGame;
    }

    /** returns the array of qualification matches in the game */
    getQMMatches(){
        return this.qmMatches;
    }

    /** returns an array of all teams in the comp */
    getTeams(){
        return this.teams
    }

    setNumQMs(numQMs: number){
        this.numQMs = numQMs;
        console.log(this.teams);
    }

    getNumQMs(){
        return this.numQMs;
    }

    /** returns the current qm number (+1 from current index) */
    getCurrentQMNumber(){
        return this.currentQM;
    }

    withQM(qm: FRCMatch, index: number){
        const newGame = new FRCGame(this.teams, this.qmMatches, this.numQMs);
        newGame.qmMatches[index] = qm;
        return newGame;
    }


    /** displays the current teams added on the comp generating menu. also generates a delete button to delete unwanted teams */
    displayTeamAddingMenu(){
        if(this.teams === undefined) return <p>teams appear here once they are added</p>
        return (
            <div>
                {this.teams.map((team, index) => (
                    <div key={index}>{team.getTeamName()}</div>
                ))}
            </div>
        );
    }
}

// Firestore data converter
export const GameConverter = {
    toFirestore: (game: FRCGame) => {
        return {
            teams: game.getTeams().map(team => TeamConverter.toFirestore(team)),
            qmMatches: game.getQMMatches().map(match => MatchConverter.toFirestore(match)),
            numQMs: game.getNumQMs(),
            currentQM: game.getCurrentQMNumber(),
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot) => {
        const data = snapshot.data();
        if (!data) return new FRCGame();

        const teams = (data.teams ?? []).map((teamData: any) =>
            new FRCTeam(teamData.teamName, teamData.teamColor, teamData.totalRP, teamData.matchesPlayed, teamData.numQMs)
        );

        const qmMatches = (data.qmMatches ?? []).map((matchData: any) =>
            new FRCMatch(
                new FRCTeam(matchData.red1.teamName, matchData.red1.teamColor, matchData.red1.totalRP, matchData.red1.matchesPlayed, matchData.red1.numQMs), 
                new FRCTeam(matchData.red2.teamName, matchData.red2.teamColor, matchData.red2.totalRP, matchData.red2.matchesPlayed, matchData.red2.numQMs), 
                new FRCTeam(matchData.red3.teamName, matchData.red3.teamColor, matchData.red3.totalRP, matchData.red3.matchesPlayed, matchData.red3.numQMs), 
                new FRCTeam(matchData.blue1.teamName, matchData.blue1.teamColor, matchData.blue1.totalRP, matchData.blue1.matchesPlayed, matchData.blue1.numQMs), 
                new FRCTeam(matchData.blue2.teamName, matchData.blue2.teamColor, matchData.blue2.totalRP, matchData.blue2.matchesPlayed, matchData.blue2.numQMs), 
                new FRCTeam(matchData.blue3.teamName, matchData.blue3.teamColor, matchData.blue3.totalRP, matchData.blue3.matchesPlayed, matchData.blue3.numQMs), 
                matchData.name, 
                matchData.winnerState)
        );

        return new FRCGame(
            teams,
            qmMatches,
            data.numQMs,
            data.currentQM
        );
    }
};