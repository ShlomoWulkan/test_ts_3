let position: string = "";
let points: number = 0;
let fg: number = 0;
let threeP: number = 0;

const form: HTMLFormElement = document.querySelector(".form") as HTMLFormElement;

form.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;

    switch (target.name) {
        case "position":
            position = (target as HTMLSelectElement).value; 
            break;
        case "points":
            points = Number(target.value); 
            break;
        case "fg":
            fg = Number(target.value); 
            break;
        case "threeP":
            threeP = Number(target.value); 
    }
    console.log(`position ${position} points ${points} fg ${fg} three ${threeP}`);
});

type Player = {
    name: string;
    position: string;
    points: number;
    fg: number;
    threeP: number;
}

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
        return players;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const showPlayers = (players: Player[]) => {
    const table: HTMLTableElement = document.querySelector(".table") as HTMLTableElement;
    table.innerHTML = "";
    players.forEach((player) => {
        const row: HTMLTableRowElement = document.createElement("tr");
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td>${player.points}</td>
            <td>${player.fg}</td>
            <td>${player.threeP}</td>
            <td><button class="delete">Delete</button></td>
        `;
        table.appendChild(row);
    });
};


form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    if (position === "") {
        alert("Please select a position");
        return;
    }
    showPlayers(await getPlayers(position, points, fg, threeP));
    console.log(await getPlayers(position, points, fg, threeP));
});

