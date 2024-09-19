"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let position = "";
let points = 0;
let fg = 0;
let threeP = 0;
const PG = document.querySelector('#PG');
const SG = document.querySelector('#SG');
const SF = document.querySelector('#SF');
const PF = document.querySelector('#PF');
const C = document.querySelector('#C');
const pointsDiv = document.querySelector('.points');
const fgDiv = document.querySelector('.FG');
const threePDiv = document.querySelector('.threeP');
const form = document.querySelector(".form");
form.addEventListener("change", (event) => {
    const target = event.target;
    switch (target.name) {
        case "position":
            position = target.value;
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
const getPlayers = (position, points, fg, threeP) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://nbaserver-q21u.onrender.com/api/filter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "position": position,
                "twoPercent": fg,
                "threePercent": threeP,
                "points": points
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const players = yield response.json();
        const filteredPlayers = players.filter(player => { var _a; return (_a = player.season) === null || _a === void 0 ? void 0 : _a.some((season) => [2022, 2023, 2024].includes(season)); });
        return filteredPlayers;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const showPlayers = (players) => {
    const table = document.querySelector(".table");
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
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.playerName}</td>
            <td>${player.position}</td>
            <td>${player.points}</td>
            <td>${player.twoPercent}</td>
            <td>${player.threePercent}</td>
            <td class="addToTeam"><button class="addToTeamBtn">Add ${player.playerName} to current Team</button></td>
        `;
        const addToTeamBtn = row.querySelector(".addToTeamBtn");
        addToTeamBtn.addEventListener("click", () => {
            addToTeam(player);
        });
        table.appendChild(row);
    });
};
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (position === "") {
        alert("Please select a position");
        return;
    }
    showPlayers(yield getPlayers(position, points, fg, threeP));
    console.log(yield getPlayers(position, points, fg, threeP));
}));
const addToTeam = (player) => {
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
const insertToBox = (plaierBox, player) => {
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
