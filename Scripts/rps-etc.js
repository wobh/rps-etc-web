/* Rock, Paper, Scissors, etc. */

var rps_hands = [
    ["paper", "covers", "rock"],
    ["rock", "crushes", "scissors"],
    ["scissors", "cuts", "paper"]];

var rpsls_hands = [
    ["lizard", "eats", "paper"],
    ["lizard", "poisons", "spock"],
    ["paper", "covers", "rock"],
    ["paper", "disproves", "spock"],
    ["rock", "crushes", "lizard"],
    ["rock", "crushes", "scissors"],
    ["scissors", "cuts", "paper"],
    ["scissors", "decapitates", "lizard"],
    ["spock", "smashes", "scissors"],
    ["spock", "vaporises", "rock"]];

function first_play (hand) {
    return hand[0];
};

function last_play (hand) {
    return hand[(hand.length - 1)];
};

function write_hand_str (hand) {
    return hand.join(" ");
};

function get_plays (hands) {
    var plays = [];
    hands.forEach(function (hand) {
	if (plays.indexOf(hand[0]) === -1) {
	    plays.push(hand[0]); }
    });
    return plays;
};

function make_play_checker (hands) {
    return (function (play) {
	var plays = get_plays(hands);
	if (plays.indexOf(play) !== -1) {
	    return play;
	} else {
	    throw new Error("Invalid play: " + play + " not in " + "[" + plays.join(", ") + "].");
	}
    });
};

function make_play_input_getter (hands, name) {
    var prompt_text = "Choose your weapon, " + name + " "
    return (function () {
	var play_checker = make_play_checker(hands);
	var play;
	var stop = false;
	do {
	    try {
		play = prompt(prompt_text).toLowerCase();
		stop = play_checker(play);
	    } catch (error) {
		alert(error.message);
	    }
	} while (stop === false);
	return play;
    });
};

var inputPlayer = function (name, hands) {
    return {
	"name": name,
	"getPlay": make_play_input_getter(hands, name)
    };
};


function random_integer (max) {
    return Math.floor(Math.random() * max);
};

function random_element (list) {
    return list[random_integer(list.length)];
};

function make_random_play_maker (hands) {
    return (function () {
	var play_checker = make_play_checker(hands);
	var plays = get_plays(hands);
	var play = random_element(plays);
	play_checker(play); // just in case
	return play;
    });
};

var randomPlayer = function (name, hands) {
    return {
	"name": name,
	"getPlay": make_random_play_maker(hands)
    };
};

function hands_match_play_p (play0, play1, hand) {
    return ((play0 === first_play(hand)) 
	    && (play1 === last_play(hand)))
	|| ((play1 === first_play(hand)) 
	    && (play0 === last_play(hand)));
};

function write_win (player) {
    return player.name + " wins!\n";
}

function eval_game (hands, player0, player1) {
    var str = "";
    var win;
    var play0 = player0.getPlay();
    var play1 = player1.getPlay();

    hands.forEach(function (hand) {
	if (hands_match_play_p(play0, play1, hand)) {
	    win = hand;
	    return;
	}
    });
    
    if (typeof win === "undefined") {
	str += write_win(new inputPlayer("No one", hands));
    } else {
	str += write_hand_str(win) + "\n";

	if (play0 === first_play(win)) {
	    str += write_win(player0);
	} else {
	    str += write_win(player1);
	}
    };
    
    return str;
};

function main (hands) {
    var player0 = new inputPlayer("Player0", hands);
    var player1 = new randomPlayer("Player1", hands);
    console.log(eval_game(hands, player0, player1));
};
