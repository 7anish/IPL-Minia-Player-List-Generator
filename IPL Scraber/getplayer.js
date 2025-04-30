import allPlayerData from "./allPlayer.js";
import { getPlayerCredit } from "./credit.js";
import puppeteer from "puppeteer";

export const getAllPlayers = async (TeamUrl) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(TeamUrl);

    await page.setViewport({ width: 1440, height: 1024 });


    const profileLinks = await page.evaluate(() => {
        const allPlayer = document.querySelectorAll('.dys-box-color');
        const list = [...allPlayer];
        return list.map((item) => (
            {
                url: item.children[0].href,
                isOverSea: item.children[0]?.children[0]?.children[0]?.children[0]?.src == 'https://www.iplt20.com/assets/images/teams-foreign-player-icon.svg',
                playerName: item.children[0].children[1].children[1].innerText,
                playerRole: item.children[0].children[1].children[2].innerText
            }
        ));
    })


    for (const player of profileLinks) {
        await getPlayers(player.url, player.playerName, player.playerRole, player.isOverSea);
    }

    browser.close()
}


const getPlayers = async (profileUrl, playerName, playerRole, isOverSea) => {
    const browser = await puppeteer.launch({ headless: false });
    const newPage = await browser.newPage()

    await newPage.goto(profileUrl);

    const playerDetails = await newPage.evaluate(() => {

        // image 
        const image = document.querySelector('.membr-details-img')
        const ImageUrl = image.children[0].src

        //stats 
        const dataTabel = document.querySelectorAll('.sm-pp-table')
        const dataTableList = [...dataTabel];
        const batstats = {}
        const batDataCell = dataTableList[0]?.children[1]?.children[1]?.children
        if (batDataCell?.length >= 14) {
            const batdata = [...batDataCell]
            if (batdata[0]?.innerText == '2025') {
                batstats.year = batdata[0]?.innerText || 'N/A'
                batstats.mat = batdata[1]?.innerText || 'N/A'
                batstats.no = batdata[2]?.innerText || 'N/A'
                batstats.runs = batdata[3]?.innerText || 'N/A'
                batstats.hs = batdata[4]?.innerText || 'N/A'
                batstats.avg = batdata[5]?.innerText || 'N/A'
                batstats.bf = batdata[6]?.innerText || 'N/A'
                batstats.sr = batdata[7]?.innerText || 'N/A'
                batstats.century = batdata[8]?.innerText || 'N/A'
                batstats.halfcentury = batdata[9]?.innerText || 'N/A'
                batstats.fours = batdata[10]?.innerText || 'N/A'
                batstats.sixes = batdata[11]?.innerText || 'N/A'
                batstats.ct = batdata[12]?.innerText || 'N/A'
                batstats.st = batdata[13]?.innerText || 'N/A'
            }
        }


        const boldataobj = dataTableList[1]?.children[1]?.children[1]?.children
        const ballstats = {}

        if (batDataCell?.length >= 10) {
            const balldata = [...boldataobj]
            if (balldata[0]?.innerText == '2025') {
                ballstats.year = balldata[0]?.innerText || 'N/A'
                ballstats.mat = balldata[1]?.innerText || 'N/A'
                ballstats.ball = balldata[2]?.innerText || 'N/A'
                ballstats.runs = balldata[3]?.innerText || 'N/A'
                ballstats.wkts = balldata[4]?.innerText || 'N/A'
                ballstats.bbm = balldata[5]?.innerText || 'N/A'
                ballstats.avg = balldata[6]?.innerText || 'N/A'
                ballstats.econ = balldata[7]?.innerText || 'N/A'
                ballstats.sr = balldata[8]?.innerText || 'N/A'
                ballstats.fourWicket = balldata[9]?.innerText || 'N/A'
                ballstats.fiveWicket = balldata[10]?.innerText || 'N/A'
            }
        }

        return {
            ImageUrl,
            batstats,
            ballstats
        }

    })

    const credit = getPlayerCredit(playerName);
    
    

    allPlayerData.push({ ...playerDetails, playerName: playerName, playerRole: playerRole, isOverSea: isOverSea, credit: credit });

    console.log(`Data Saved for ${playerName}`)

    browser.close()
}