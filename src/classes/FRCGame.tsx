import type { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { FRCMatch, MatchConverter } from "./FRCMatch";
import { FRCTeam, TeamConverter } from "./FRCTeam"
import { AllianceConverter } from "./FRCAlliance";

export class FRCGame{
    private teams: FRCTeam[];
    private qmMatches: FRCMatch[];
    private numQMs: number;
    private currentQM: number;

    constructor(teams?: FRCTeam[], qmMatches?: FRCMatch[], numQMs?: number, currentQM?: number){
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
        else{
            this.numQMs = 0;
        }
        if(currentQM !== undefined)
            this.currentQM = currentQM;
        else{
            this.currentQM = 1;
        }
    }

    withTestTeams(){
        const newGame = new FRCGame([], this.qmMatches, this.numQMs, this.currentQM);
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
        const newGame = new FRCGame([], this.qmMatches, this.numQMs, this.currentQM);
        newGame.teams = [...this.teams, team];
        return newGame;
    }

    /** returns a new FRCTeam object (thanks alot react) with the specified team removed(if it exists) */
    withTeamRemovedAtIndex(index: number): FRCGame{
        const newGame = new FRCGame([], this.qmMatches, this.numQMs, this.currentQM);
        newGame.teams = this.teams.filter((_, i) => i !== index);
        console.log("new game: " + newGame.getTeams());
        return newGame;
    }

    /** returns a new FRCTeam object with the desired qm matches
     * @param qmMatches the qualification matches to be used in the game
     */
    withQMMatches(qmMatches: FRCMatch[]){
        const newGame = new FRCGame(this.teams, [], this.numQMs, this.currentQM);
        newGame.qmMatches = qmMatches;
        return newGame;
    }

    withUpdatedCurrentMatch(qmMatch: FRCMatch){
        const newGame = new FRCGame(this.teams, this.qmMatches, this.numQMs, this.currentQM);
        newGame.qmMatches[this.currentQM - 1] = qmMatch;
        return newGame;
    }

    iterateQM(){
        const newGame = new FRCGame(this.teams, this.qmMatches, this.numQMs, this.currentQM);
        if(this.currentQM < this.qmMatches.length) newGame.currentQM = newGame.currentQM + 1;
        console.log("newgame currentqm: " + newGame.getCurrentQMNumber());
        return newGame;
    }

    getCurrentQMMatch(){
        return this.qmMatches[this.currentQM - 1];
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
        const newGame = new FRCGame(this.teams, this.qmMatches, this.numQMs, this.currentQM);
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

    calculateTeamPoints(){
        this.qmMatches.forEach((match) => {

        })
    }
}

// Firestore data converter
export const GameConverter = {
    toFirestore: (game: FRCGame) => {
        console.log("frcgame tofirestore current qm number: " + game.getCurrentQMNumber())
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

        console.log(teams);

        const qmMatches = (data.qmMatches ?? []).map((matchData: any) =>
            new FRCMatch(
                AllianceConverter.fromFirestore(matchData.redAlliance, teams),
                AllianceConverter.fromFirestore(matchData.blueAlliance, teams),
                matchData.name, 
                matchData.played)
        );

        console.log("current QM from firebase data: " + data.currentQM);

        return new FRCGame(
            teams,
            qmMatches,
            data.numQMs,
            data.currentQM
        );
    }
};