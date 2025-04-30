import { Players } from "./players.js";


export const getPlayerCredit = (playerName) =>{
    const data  = Players.find((p)=> (p.Name).toLowerCase() == playerName.toLowerCase() );
    return data?.Value  || "Not Found"
}