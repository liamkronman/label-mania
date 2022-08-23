const uuidv4 = require("uuid").v4;

var games = new Map();

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
	}
	endRound(io) {
		// todo: compute score diff, compute median trap
		var round = this.rounds[this.rounds.length - 1];
		if (round.roundStatus != 1) return;
		round.roundStatus = 2;
		const data = { score: this.userScores, traps: round.traps };
		io.to(this.gameID).emit("end_round", data);

		// todo: set timer to begin new round automatically
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

		/* Request round end */
		socket.on("request_round_start", () => {
			this.gameroom.endRound();
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
