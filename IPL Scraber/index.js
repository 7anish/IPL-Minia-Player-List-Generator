import allPlayerData from "./allPlayer.js";
import { saveToCsv } from "./csv.js";
import { getAllPlayers } from "./getplayer.js";


const fetchPlayer = async ()=>{
    const Teams = [
        'https://www.iplt20.com/teams/chennai-super-kings',
        'https://www.iplt20.com/teams/delhi-capitals',
        'https://www.iplt20.com/teams/gujarat-titans',
        'https://www.iplt20.com/teams/kolkata-knight-riders',
        'https://www.iplt20.com/teams/lucknow-super-giants',
        'https://www.iplt20.com/teams/mumbai-indians',
        'https://www.iplt20.com/teams/punjab-kings',
        'https://www.iplt20.com/teams/rajasthan-royals',
        'https://www.iplt20.com/teams/royal-challengers-bengaluru',
        'https://www.iplt20.com/teams/sunrisers-hyderabad'
    ]

    for (const url of Teams){
        await getAllPlayers(url)
    }

    saveToCsv(allPlayerData);
}

fetchPlayer();