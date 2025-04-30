import { createObjectCsvWriter } from "csv-writer";

export const saveToCsv = async (allPlayerData) => {
    const csvWriter = createObjectCsvWriter({
        path: 'test.csv',
        header: [
            { id: 'playerName', title: 'Player Name' },
            { id: 'playerRole', title: 'Player Role' },
            { id: 'isOverSea', title: 'Is Over Sea' },
            { id: 'imageUrl', title: 'Image URL' },
            { id: 'battingYear', title: 'Batting Year' },
            { id: 'battingMatches', title: 'Batting Matches' },
            { id: 'notOuts', title: 'Not Outs' },
            { id: 'runs', title: 'Runs' },
            { id: 'highScore', title: 'High Score' },
            { id: 'battingAverage', title: 'Batting Average' },
            { id: 'ballsFaced', title: 'Balls Faced' },
            { id: 'battingStrikeRate', title: 'Batting Strike Rate' },
            { id: 'centuries', title: 'Centuries' },
            { id: 'halfCenturies', title: 'Half Centuries' },
            { id: 'fours', title: 'Fours' },
            { id: 'sixes', title: 'Sixes' },
            { id: 'catches', title: 'Catches' },
            { id: 'stumpings', title: 'Stumpings' },
            { id: 'bowlingYear', title: 'Bowling Year' },
            { id: 'bowlingMatches', title: 'Bowling Matches' },
            { id: 'ballsBowled', title: 'Balls Bowled' },
            { id: 'runsConceded', title: 'Runs Conceded' },
            { id: 'wickets', title: 'Wickets' },
            { id: 'bestBowling', title: 'Best Bowling' },
            { id: 'bowlingAverage', title: 'Bowling Average' },
            { id: 'economy', title: 'Economy' },
            { id: 'bowlingStrikeRate', title: 'Bowling Strike Rate' },
            { id: 'fourWicketHauls', title: '4 Wicket Hauls' },
            { id: 'fiveWicketHauls', title: '5 Wicket Hauls' },
            { id: 'credit', title: 'Credit' }
        ]
    });


    const records = allPlayerData.map(player => ({
        playerName: player?.playerName,
        playerRole: player?.playerRole,
        isOverSea: player?.isOverSea,
        imageUrl: player?.ImageUrl,
        battingYear: player?.batstats?.year,
        battingMatches: player?.batstats?.mat,
        notOuts: player?.batstats?.no,
        runs: player?.batstats?.runs,
        highScore: player?.batstats?.hs,
        battingAverage: player?.batstats?.avg,
        ballsFaced: player?.batstats?.bf,
        battingStrikeRate: player?.batstats?.sr,
        centuries: player?.batstats?.century,
        halfCenturies: player?.batstats?.halfcentury,
        fours: player?.batstats?.fours,
        sixes: player?.batstats?.sixes,
        catches: player?.batstats?.ct,
        stumpings: player?.batstats?.st,
        bowlingYear: player?.ballstats?.year,
        bowlingMatches: player?.ballstats?.mat,
        ballsBowled: player?.ballstats?.ball,
        runsConceded: player?.ballstats?.runs,
        wickets: player?.ballstats?.wkts,
        bestBowling: player?.ballstats?.bbm ? player?.ballstats?.bbm.split('/').join('w') : 'N/A',
        bowlingAverage: player?.ballstats?.avg,
        economy: player?.ballstats?.econ,
        bowlingStrikeRate: player?.ballstats?.sr,
        fourWicketHauls: player?.ballstats?.fourWicket,
        fiveWicketHauls: player?.ballstats?.fiveWicket,
        credit: player?.credit
    }))

    await csvWriter.writeRecords(records);

}