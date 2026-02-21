import type { FRCGame } from "../classes/FRCGame";
import { FRCMatch } from "../classes/FRCMatch";
import { shuffleArray } from "./ShuffleArray";

/** @param game the FRC game to generate matches for*/
export function generateQMs(game: FRCGame): FRCMatch[]{
    const teamArray = game.getTeams();
    var leastNumQMs = 0;
    var qmMatches = []

    for(let i = 0; i < game.getNumQMs(); i++){
        var leastQMs = [];
        var alternatives = [];
        for(let i = 0; i < teamArray.length; i++){
            if(teamArray[i].getNumQMs() == leastNumQMs) leastQMs.push(teamArray[i]);
            else alternatives.push(teamArray[i]);
        }
        var selected = [];
        if(leastQMs.length >= 6){
            shuffleArray(leastQMs);
            selected = leastQMs.slice(0, 6);
        }
        else{
            leastNumQMs++;
            selected = leastQMs;
            var iterations = 6 - selected.length
            for(let i = 0; i < iterations; i++){
                selected.push(alternatives[i]);
            }
        }
        for(let i = 0; i < selected.length; i++){
            selected[i].incrementNumQMs();
        }
        qmMatches.push(new FRCMatch(selected[0], selected[1], selected[2], selected[3], selected[4], selected[5], "qm" + (qmMatches.length + 1)));
    }
    return qmMatches;
}