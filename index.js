import axios from "axios";
import 'dotenv'

const API_TOKEN = process.env.API_TOKEN

const fetchTeam = async ()=>{
    const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/teams/season/1689?api_token=${API_TOKEN}`)

    console.log(res.data);
}

fetchTeam();