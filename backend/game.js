const uuidv4 = require("uuid").v4;

class Round {
	constructor() {
		this.imgurl = "/cat.webp"; // automatic
		this.target = "cat";
	}
}

class Connection {
	constructor(io, socket) {
		this.socket = socket;
		this.io = io;

		socket.on("disconnect", () => this.disconnect());
		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
	}

	disconnect() {
		users.delete(this.socket);
	}
}

function game(io) {
	io.on("connection", (socket) => {
		console.log("Successfully connected to socket id ", socket.id);
		new Connection(io, socket);
	});
}

module.exports = game;
