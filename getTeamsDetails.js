import axios from "axios";
import 'dotenv'

const API_TOKEN = process.env.API_TOKEN


// Chennai Super Kings
// Delhi Capitals
// Punjab Kings
// Kolkata Knight Riders
// Mumbai Indians
// Rajasthan Royals
// Royal Challengers Bengaluru
// Sunrisers Hyderabad
// Gujarat Titans
// Lucknow Super Giants


const getTeamsDetails = async (teamName)=>{

    if(!teamName) throw 'Team name is required'
    const encodedTeamName = encodeURIComponent(teamName)
    const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/teams?api_token=01AxCFLSH3wMxENfcJt7XbtAU7pozsSNhtE2no3M6J3exc4hWwnG0hpgD4eH&filter[name]=${encodedTeamName}`);

    console.log(res.data.data[0].id);
    return res.data.data[0].id
}


const getSquadDetails = async ()=>{

    const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/teams/2/squad/1689?api_token=01AxCFLSH3wMxENfcJt7XbtAU7pozsSNhtE2no3M6J3exc4hWwnG0hpgD4eH`);

    console.log(res.data)
}

const getPlayerDetails = async ()=>{

    const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/players/4856?api_token=01AxCFLSH3wMxENfcJt7XbtAU7pozsSNhtE2no3M6J3exc4hWwnG0hpgD4eH`);

    console.log(res.data)
}
