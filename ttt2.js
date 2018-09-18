function build_full_space() {
	startNode = {pos: -1, player: 2, parent: null, children: [], depth: 0,	x_has_won: false, o_has_won: false};
	return ttt_recur(startNode);
}

function ttt_recur(node) {
	if(node.depth == 10) { return null; }
	checkNode = node;
	path = [];
	while(checkNode != null) {
			if(path.includes(checkNode.pos)) {
					return null;
			}
			path.push(checkNode.pos);
			checkNode = checkNode.parent;
	}
	
	if(is_win(node, 1)) {
		node.x_has_won = true;
	}
	if(is_win(node, 2)) {
		node.o_has_won = true;
	}
	if(is_tie(node)) {
		node.has_tied = true;
	}
	if(node.x_has_won || node.o_has_won || node.has_tied) {
		if(node.x_has_won) {
				node.x_wins = 1;
				node.o_wins = 0;
				node.ties = 0;
				return node;
		}
		if(node.o_has_won) {
				node.o_wins = 1;
				node.x_wins = 0;
				node.ties = 0;
				return node;
		}
		if(node.has_tied) {
				node.ties = 1;
				node.x_wins = 0;
				node.o_wins = 0;
				return node;
		}
	}
	for(var i = 0; i < 9; i++) {
			node.children.push(ttt_recur({pos: i, player: node.player == 1 ? 2 : 1, parent: node, children: [], depth: node.depth + 1, remove_self: false, x_has_won: false, o_has_won: false, has_tied: false}));
	}
	
	node.x_wins = 0;
	node.o_wins = 0;
	node.ties = 0;
	for(var i = 0; i < 9; i++) {
			if(node.children[i] != null) {
					node.x_wins += node.children[i].x_wins;
					node.o_wins += node.children[i].o_wins;
					node.ties += node.children[i].ties;
			}
	}
	return node;
}

function is_win(node, p) {
		checkNode = node;
		list = [];
		while(checkNode != null) {
			if(checkNode.player == p) {
				list.push(checkNode.pos);
			}
			checkNode = checkNode.parent;
		}
		if(is_line(list, 0, 1, 2) || is_line(list, 3, 4, 5) ||is_line(list, 6, 7, 8) ||
			is_line(list, 0, 3, 6) ||is_line(list, 1, 4, 7) ||is_line(list, 2, 5, 8) ||
			is_line(list, 0, 4, 8) ||is_line(list, 2, 4, 6)){
			return true;
		} else {
				return false;
		}
}

function is_list_win(list) {
		if(is_line(list, 0, 1, 2) || is_line(list, 3, 4, 5) ||is_line(list, 6, 7, 8) ||
			is_line(list, 0, 3, 6) ||is_line(list, 1, 4, 7) ||is_line(list, 2, 5, 8) ||
			is_line(list, 0, 4, 8) ||is_line(list, 2, 4, 6)){
			return true;
		} else {
				return false;
		}
}

function is_line(list, a, b, c) {
		if(list.includes(a) && list.includes(b) && list.includes(c)) {
				return true;
		} else {
				return false;
		}
}

function is_tie(node, p) {
	checkNode = node;
		list = [];
		while(checkNode != null) {
			list.push(checkNode.pos);
			checkNode = checkNode.parent;
		}
		
		if(list.length == 10 && !is_win(node, 1) && !is_win(node, 2)) {
			return true;
		} else {
				return false;
		}
}


function win_or_tie_in_all_cases(node, p) {
	if(node.x_has_won || node.o_has_won || node.has_tied) {
		return node;
	}
	for(var i = 0; i < 9; i++) {
		if(node.children[i] != null) {
			node.children[i] = win_or_tie_in_all_cases(node.children[i], p);
		}
	}
	
	//Mark self to be removed if no children
	found = 0;
	for(var i = 0; i < 9; i++) {
		if(node.children[i] != null) {
			found += 1;
		}
	}
	if(found == 0) {
			if(p == 1) {
					node.o_has_won = true;
			} else {
					node.x_has_won = true;
			}
			return node;
	}
	
	if(node.player == p) {
		for(var i = 0; i < 9; i++) {
			if(node.children[i] != null) {
				if(p == 1) {
					if(node.children[i].o_has_won) {
							return null;
					}
				}
				if(p == 2) {
					if(node.children[i].x_has_won) {
							return null;
					}
				}
				
			}
		}
	}
	
	node.x_wins = 0;
	node.o_wins = 0;
	node.ties = 0;
	//Recalculate self after removing problematic children
	for(var i = 0; i < 9; i++) {
		if(node.children[i] != null) {
			node.x_wins += node.children[i].x_wins;
			node.o_wins += node.children[i].o_wins;
			node.ties += node.children[i].ties;
		}
	}
	
	

	return node;
}

function findBestMove(moves, p) {
	ai = null;
	if(p == 1) ai = x_ai;
	if(p == 2) ai = o_ai;
	
	for(var i = 0; i < moves.length; i++) {
			ai = ai.children[moves[i]];
	}
	
	found = 0;
	foundList = [];
	for(var i = 0; i < 9; i++) {
			if(ai.children[i] != null) {
				foundList.push(i);
				found++;
			}
	}
	
	if(found == 0) return -1;
	
	return foundList[Math.floor(Math.random() * foundList.length)];
}

gameSoFar = [];
xSoFar = [];
oSoFar = [];
function update(x) {
	gameSoFar.push(x);
	xSoFar.push(x);
	document.getElementById(x).innerHTML = "X";
	document.getElementById(x).disabled = true;
	if(is_list_win(xSoFar) || gameSoFar.length == 9) {
		lock_all();
		if(gameSoFar.length == 9) {
			document.getElementById("label").innerHTML = "Tie";
		}
	} else {
		next = findBestMove(gameSoFar, 2);
		gameSoFar.push(next);
		oSoFar.push(next);
		document.getElementById(next).innerHTML = "O";
		document.getElementById(next).disabled = true;
		if(is_list_win(oSoFar)) {
			document.getElementById("label").innerHTML = "You lose";
			lock_all();
		}
	}
}

function lock_all() {
		for(var i = 0; i < 9; i++) {
				document.getElementById(""+i).disabled = true;
		}
}

function reset() {
		gameSoFar = [];
		xSoFar=[];
		oSoFar = [];
		document.getElementById("label").innerHTML = "";
		for(var i = 0; i < 9; i++) {
				document.getElementById(""+i).disabled = false;
				document.getElementById(""+i).innerHTML = "_";
		}
}

var x_ai = win_or_tie_in_all_cases(build_full_space(), 1);
var o_ai = win_or_tie_in_all_cases(build_full_space(), 2);

console.log(findBestMove([],1));