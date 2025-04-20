import axios from "axios";
import ExcelJS from "exceljs";
import 'dotenv/config';
import cliProgress from "cli-progress";

const API_TOKEN = process.env.API_TOKEN;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getSeasonDetails = async () => {
  const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/leagues?api_token=${API_TOKEN}`);
  const data = res.data.data.filter(item => item.code === 'IPL');
  return {
    name: data[0].name,
    season_id: data[0].season_id,
    code: data[0].code
  };
};

const getTeamsDetails = async (teamName) => {
  if (!teamName) throw 'Team name is required';
  const encodedTeamName = encodeURIComponent(teamName);
  const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/teams?api_token=${API_TOKEN}&filter[name]=${encodedTeamName}`);
  return res.data.data[0].id;
};

const getSquadDetails = async (teamId, seasonId) => {
  const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/teams/${teamId}/squad/${seasonId}?api_token=${API_TOKEN}`);
  return res.data.data.squad;
};

const getPlayerDetails = async (playerId) => {
  const res = await axios.get(`https://cricket.sportmonks.com/api/v2.0/players/${playerId}?api_token=${API_TOKEN}&include=career`);
  return res.data.data;
};

const calculateCredit = (career) => {
    let credit = 0;
    if (career.batting && career.bowling) {
      credit = (calculateBatterCredit(career.batting) + calculateBowlerCredit(career.bowling)) / 2;
    } else if (career.batting) {
      credit = calculateBatterCredit(career.batting);
    } else if (career.bowling) {
      credit = calculateBowlerCredit(career.bowling);
    }
  
    // Normalize credit to 0-10 scale
    const maxPossibleCredit = 10; // you can tune this if needed
    const scaledCredit = Math.min((credit / 10) * maxPossibleCredit, 10); // cap at 10
    return scaledCredit.toFixed(1);
  };
  

const calculateBatterCredit = (batting) => {
  const runsPerMatch = batting.runs_scored / batting.matches;
  const strikeRate = batting.strike_rate / 100;
  const average = batting.average / 50;
  const milestoneBonus = (batting.fifties >= 2 ? 2 : (batting.fifties >= 1 ? 1 : 0));
  return (3 * runsPerMatch) + (2 * strikeRate) + (3 * average) + milestoneBonus;
};

const calculateBowlerCredit = (bowling) => {
  const wicketsPerMatch = bowling.wickets / bowling.matches;
  const idealEconRate = 7;
  const econRateScore = bowling.econ_rate > 0 ? (idealEconRate / bowling.econ_rate) : 0;
  const idealAvg = 20;
  const avgScore = bowling.average > 0 ? (idealAvg / bowling.average) : 0;
  const milestoneBonus = (bowling.four_wickets ? 1 : 0) + (bowling.five_wickets ? 2 : 0);
  const penalty = (bowling.wide + bowling.noball) / bowling.overs * 0.5;
  return (4 * wicketsPerMatch) + (2 * econRateScore) + (2 * avgScore) + milestoneBonus - penalty;
};

const writeToExcel = async (playerData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('IPL Player Stats');
  worksheet.columns = [
    { header: 'Team Name', key: 'team', width: 25 },
    { header: 'Player Name', key: 'name', width: 30 },
    { header: 'Batting Stats', key: 'batting', width: 60 },
    { header: 'Bowling Stats', key: 'bowling', width: 60 },
    { header: 'Credit', key: 'credit', width: 10 },
  ];
  playerData.forEach(player => worksheet.addRow(player));
  await workbook.xlsx.writeFile('IPL_Player_Stats.xlsx');
  console.log('✅ Excel file created as IPL_Player_Stats.xlsx');
};

const testAllTeams = async () => {
    const season = await getSeasonDetails();
    console.log(`🏏 Season: ${season.name} (ID: ${season.season_id})`);

    const teamNames = [
        "Chennai Super Kings", "Delhi Capitals", "Punjab Kings", "Kolkata Knight Riders",
        "Mumbai Indians", "Rajasthan Royals", "Royal Challengers Bengaluru", "Sunrisers Hyderabad",
        "Gujarat Titans", "Lucknow Super Giants"
    ];

    let allPlayerData = [];
    const teamProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    console.log(`\n🏏 Starting IPL Data Pipeline for Season: ${season.name}\n`);
    teamProgress.start(teamNames.length, 0);

    // Iterate through all teams
    for (const teamName of teamNames) {
        const teamId = await getTeamsDetails(teamName);
        console.log(`✅ Team: ${teamName} (ID: ${teamId})`);
        
        const squad = await getSquadDetails(teamId, season.season_id);
        console.log(`📝 Squad size: ${squad.length}`);

        // Iterate through all players in the squad
        for (const player of squad) {
            console.log(`🎯 Testing player: ${player.fullname} (ID: ${player.id})`);
            
            const playerDetails = await getPlayerDetails(player.id);
            const careerInSeason = playerDetails.career.find(c => c.season_id === season.season_id);
            
            if (!careerInSeason) {
                console.log(`⚠️ No stats found for ${player.fullname} in current season.`);
                continue; // Skip if no career stats for this player in the current season
            }

            const credit = calculateCredit(careerInSeason);

            console.log(`
            📊 Player: ${player.fullname}
            Batting: ${JSON.stringify(careerInSeason.batting)}
            Bowling: ${JSON.stringify(careerInSeason.bowling)}
            Credit: ${credit}
            `);

            // Push player stats into the data array for later processing
            allPlayerData.push({
                team: teamName,
                name: player.fullname,
                batting: JSON.stringify(careerInSeason.batting),
                bowling: JSON.stringify(careerInSeason.bowling),
                credit: credit
            });

            // Sleep between requests to prevent API rate limiting
            await sleep(300);
        }

        teamProgress.increment();
    }

    teamProgress.stop();
    console.log(`\n🎉 Processed players for ${teamNames.length} teams.`);

    // Optionally write the collected data to an Excel file
    await writeToExcel(allPlayerData);
};

// Run the function to test for all teams and players
testAllTeams();

  