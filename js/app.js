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
const form = document.querySelector(".form");
form.addEventListener("change", (event) => {
    const target = event.target;
    switch (target.name) {
        case "position":
            position = target.value;
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
        return players;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const showPlayers = (players) => {
    const table = document.querySelector(".table");
    table.innerHTML = "";
    players.forEach((player) => {
        const row = document.createElement("tr");
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
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (position === "") {
        alert("Please select a position");
        return;
    }
    showPlayers(yield getPlayers(position, points, fg, threeP));
    console.log(yield getPlayers(position, points, fg, threeP));
}));
