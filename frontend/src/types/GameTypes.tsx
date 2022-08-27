export type USERID_TYPE = number;

export interface InitData {
	userid: USERID_TYPE;
}

export interface PositionData {
	currX: number | null;
	currY: number | null;
	fixedX: number | null;
	fixedY: number | null;
	finalX: number | null;
	finalY: number | null;
}
export interface RoundBeginData {
	// All the information client needs to begin the round
	imgurl: string;
	target: string;
}

export interface Trap {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface DisplayTrapData extends Trap {
	strokeStyle?: string;
	fillStyle?: string;
}

export interface SubmitTrapData extends Trap {}

export interface RoundEndData {
	scores?: { [key: string]: number };
	traps?: { [key: string]: DisplayTrapData };
}
