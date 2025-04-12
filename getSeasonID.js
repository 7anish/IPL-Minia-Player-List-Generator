import axios from "axios"

const getSeasonDetails = async (API_TOKEN) => {
    // fetch the season id
    const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/leagues?api_token=${API_TOKEN}`)

    // filter IPL from all the leagues
    const data = res.data.data.filter((item)=>{
        return item.code == 'IPL'
    })

    // print the data of ipl
    console.log(data);

    return {
        name : data[0].name,
        season_id : data[0].season_id,
        code : data[0].code
    }
}

export default getSeasonDetails