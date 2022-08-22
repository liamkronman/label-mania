const uuidv4 = require("uuid").v4;

class Round {
	constructor(imgurl) {
		this.traps = new Map();
	}

	addTrap(data) {
		this.traps.push(data);
	}

	getRoundInfo() {
		data = {
			imgurl: this.imgurl,
		};
		return JSON.stringify(data);
	}
}
let rounds = [];

class Connection {
	constructor(io, socket) {
		this.socket = socket;
		this.io = io;

		socket.on("onTrap", (raw_data) => this.onTrap(raw_data));
	}

	onTrap(raw_data) {
		data = JSON.parse(raw_data);
		current_round.addTrap(data);
	}
}

function play(io) {
	io.on("connection", (socket) => {
		// users.add(socket);
		new Connection(io, socket);
	});
}

module.exports = play;
