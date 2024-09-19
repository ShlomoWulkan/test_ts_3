// variables to store user inputs
let position: string = "";
let points: number = 0;
let fg: number = 0;
let threeP: number = 0;

// variables to store html elements of the players of each position
const PG: HTMLDivElement = document.querySelector('#PG') as HTMLDivElement;
const SG: HTMLDivElement = document.querySelector('#SG') as HTMLDivElement;
const SF: HTMLDivElement = document.querySelector('#SF') as HTMLDivElement;
const PF: HTMLDivElement = document.querySelector('#PF') as HTMLDivElement;
const C: HTMLDivElement = document.querySelector('#C') as HTMLDivElement;

// variables to store html elements to swow the values 
const pointsDiv: HTMLDivElement = document.querySelector('.points') as HTMLDivElement;
const fgDiv: HTMLDivElement = document.querySelector('.FG') as HTMLDivElement;
const threePDiv: HTMLDivElement = document.querySelector('.threeP') as HTMLDivElement;

// get the form for change listener
const form: HTMLFormElement = document.querySelector(".form") as HTMLFormElement;

// add event listener to the form
form.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;

    switch (target.name) {
        case "position":
            position = (target as HTMLSelectElement).value; 
            break;
        case "points":
            points = Number(target.value); 
            pointsDiv.textContent = points.toString();
            break;
        case "fg":
            fg = Number(target.value); 
            fgDiv.textContent = fg.toString();
            break;
        case "threeP":
            threeP = Number(target.value); 
            threePDiv.textContent = threeP.toString();
    }
});

// create player type
type Player = {
    playerName: string;
    position: string;
    points: number;
    twoPercent: number;
    threePercent: number;
}

// get players function that returns a list of players based on user inputs 
const getPlayers = async (position: string, points: number, fg: number, threeP: number): Promise<Player[]> => {
    try {
        const response = await fetch(`https://nbaserver-q21u.onrender.com/api/filter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "position":position,
                "twoPercent":fg,
                "threePercent":threeP,
                "points":points
                }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const players: Player[] = await response.json();

        const filteredPlayers = players.filter(player => 
            (player as any).season?.some((season: number) => [2022, 2023, 2024].includes(season))
        );

        return filteredPlayers;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// show players function that shows the players in the table
const showPlayers = (players: Player[]) => {
    const table: HTMLTableElement = document.querySelector(".table") as HTMLTableElement;
    table.innerHTML = `
        <tr class="tableHeader">
        <th>Player</th>
        <th>Position</th>
        <th>Points</th>
        <th>FG%</th>
        <th>3P%</th>
        <th>Action</th>
        </tr>
    `;
    players.forEach((player) => {
        const row: HTMLTableRowElement = document.createElement("tr");
        row.innerHTML = `
            <td>${player.playerName}</td>
            <td>${player.position}</td>
            <td>${player.points}</td>
            <td>${player.twoPercent}</td>
            <td>${player.threePercent}</td>
            <td class="addToTeam"><button class="addToTeamBtn">Add ${player.playerName} to current Team</button></td>
        `;
        const addToTeamBtn: HTMLButtonElement = row.querySelector(".addToTeamBtn") as HTMLButtonElement;
        addToTeamBtn.addEventListener("click", () => {
            addToTeam(player);
        });
        table.appendChild(row);

    });
};

// event listener for the submit button to get the matches players
form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    if (position === "") {
        alert("Please select a position");
        return;
    }
    showPlayers(await getPlayers(position, points, fg, threeP));
});

// add to team function that adds the player to the team by clicking the add button
const addToTeam = (player: Player) => {

    switch (player.position) {
        case "PG":
            PG.innerHTML = "<h4>Point Guard</h4>";
            insertToBox(PG, player); 
            break;
        case "SG":
            SG.innerHTML = "<h4>Shooting Guard</h4>";
            insertToBox(SG, player);
            break;
        case "SF":
            SF.innerHTML = "<h4>Small Forward</h4>";
            insertToBox(SF, player);
            break;
        case "PF":
            PF.innerHTML = "<h4>Power Forward</h4>";
            insertToBox(PF, player);
            break;
        case "C":
            C.innerHTML = "<h4>Center</h4>";
            insertToBox(C, player);
            break;
    }
};

// insert to box function that accepts a box and a player and inserts 
//the player to a box team
const insertToBox = (plaierBox: HTMLDivElement, player: Player) => {
    const playerName = document.createElement("p");
    const playerPoints = document.createElement("p");
    const playerFG = document.createElement("p");
    const player3P = document.createElement("p");
    playerName.textContent = player.playerName;
    playerPoints.textContent = `Points: ${player.points}`;
    playerFG.textContent = `Two Precents: ${player.twoPercent}%`;
    player3P.textContent = `Three Precents: ${player.threePercent}%`;
    plaierBox.appendChild(playerName);
    plaierBox.appendChild(player3P);
    plaierBox.appendChild(playerFG);
    plaierBox.appendChild(playerPoints);
};
