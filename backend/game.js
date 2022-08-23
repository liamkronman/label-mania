const uuidv4 = require("uuid").v4;

var games = new Map();

const ROUND_TIMEOUT = 30;
const ROUND_DELAY = 10;

class GameRoom {
	constructor(gameID) {
		this.gameID = gameID;
		this.rounds = [];
		this.userScores = new Map(); // user: score
	}
	addPlayer(userID) {
		this.userScores[userID] = 0;
	}
	startRound(io) {
		if (
			this.rounds.length &&
			this.rounds[this.rounds.length - 1].roundStatus == 1
		)
			return;
		var new_round = new Round();
		this.rounds.push(new_round);
		const data = new_round.getRoundData();
		io.to(this.gameID).emit("begin_round", data);
		setTimeout(() => this.endRound(io, new_round), ROUND_TIMEOUT * 1000);
	}
	endRound(io, round) {
		if (round.roundStatus != 1) return;
		// todo: compute score diff, compute median trap
		round.roundStatus = 2;
		const data = { score: this.userScores, traps: round.traps };
		io.to(this.gameID).emit("end_round", data);
		setTimeout(() => this.startRound(io), ROUND_DELAY * 1000);
	}
}

class Round {
	constructor() {
		this.imgurl = "/cat.webp"; // automatic
		this.target = "cat";
		this.userTraps = new Map(); // user: Trap
		this.roundStatus = 1; // 1 = running, 2 = ended
	}
	getRoundData() {
		return { imgurl: this.imgurl, target: this.target };
	}
	nth_ele(arr, l, r, n) {
		// assert(0 <= n < r-l)
		if (r - l <= 1) return;
		k = Math.random(l, r);
		p = arr[k];
		var i = l,
			j = r;
		const swap = (a, b) => {
			[arr[a], arr[b]] = [arr[b], arr[a]];
		};
		while (i < j)
			if (p < arr[i]) swap(i, --j);
			else ++i;
		if (n < i - l) this.nth_ele(arr, l, i, n);
		else this.nth_ele(arr, i, r, n - (i - l));
	}
	median(arr) {
		n = arr.length;
    this.nth_ele(arr, 0, arr.length, n//2);
	}
	computeTruth() {}
}

function joinGameRoom(socketID, gameID) {
	var game = games[gameID];
	if (!game) game = games[gameID] = new GameRoom(gameID);

	game.addPlayer(socketID);

	return game;
}

class Connection {
	constructor(io, socket, gameID) {
		this.socket = socket;
		this.io = io;

		this.userID = socket.id;
		this.gameroom = joinGameRoom(this.userID, gameID);

		if (this.gameroom === null)
			console.log("Socket id %s failed to join room %s", socket.id, gameID); // if we add permissions later
		socket.join(this.gameroom.gameID);

		/* Submitting a trap */
		socket.on("submit_trap", (socket) => {
			// todo: need to check if the round the user is submitting to IS the round we are currently on (in case there's lag)
			console.log("Player", this.userID, "submitted trap", socket.data);
			data = socket.data;
			const cur_round = this.gameroom.rounds[this.gameroom.rounds.length - 1];
			cur_round.userTraps[this.userID] = data.trap;
		});

		/* Request round start */
		socket.on("request_round_start", () => {
			this.gameroom.startRound();
		});

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
	}
}

function game(io) {
	io.on("connection", (socket) => {
		console.log("Successfully connected to socket id ", socket.id);
		new Connection(io, socket, "temp_room");
	});
}

module.exports = game;
