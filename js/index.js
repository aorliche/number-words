const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];
	
let words = [];
let word = null;
let letters = [];	// DOM divs
let letterIdx = 0;
let arrow = null;
let arrowLoaded = false;

function digitToHumber(d) {
	const ones = d%10;
	const tens = (d-ones)/10;
	return String.fromCharCode(0x5500 + 0x10*tens + ones);
}

function makeOddsOrEvens(mod) {
	const arr = [];
	for (let i=1; i<52; i++) {
		if (i%2 == mod) {
			arr.push(i);
		}
	}
	return arr;
}

function makeOdds() {
	return makeOddsOrEvens(1);
}

function makeEvens() {
	return makeOddsOrEvens(0);
}

const fibonacci = [1,2,3,5,8,13,21,34,55,89];
const squares = [1,4,9,16,25,36,49,64,81];
const cubes = [1,8,27,64];
const triangular = [1,3,6,10,15,21,28,36];
const tetrahedral = [1,4,10,20,35,56];
const odds = makeOdds();
const evens = makeEvens();
const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];

const numbersBook = [
	['fibonacci number', fibonacci],
	['square number', squares],
	['cubic number', cubes],
	//['triangular number', triangular],
	//['tetrahedral number', tetrahedral],
	['odd number', odds],
	['even number', evens],
	['prime number', primes],
];

function randArrElt(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

function shuffle(arr) {
	for (let i=0; i<arr.length; i++) {
		const sav = arr[i];
		const j = Math.floor(Math.random()*arr.length);
		arr[i] = arr[j];
		arr[j] = sav;
	}
}

function nextLetter() {
	// Correct choice
	const correctTypeAndNums = randArrElt(numbersBook);
	const correctNum = randArrElt(correctTypeAndNums[1]);
	// Create choices
	const nums = [correctNum];
	const choices = [word[letterIdx]];
	// Letters
	for (let i=0; i<3; i++) {
		// lowercase letter
		const cand = String.fromCharCode(0x61 + Math.floor(Math.random()*26));
		// redo
		if (choices.includes(cand)) {
			i--;
			continue;
		}
		choices.push(cand);
	}
	// Nums
	for (let i=0; i<3; i++) {
		const numCand = Math.floor(Math.random()*50)+1;
		if (correctTypeAndNums[1].includes(numCand) || nums.includes(numCand)) {
			i--;
			continue;
		}
		nums.push(numCand);
	}
	const choices2 = [];
	for (let i=0; i<4; i++) {
		choices2.push([choices[i], nums[i]]);
	}
	shuffle(choices2);
	// Position hint
	const hint = document.createElement('div');
	hint.classList.add('hint');
	const span = document.createElement('span');
	span.innerText = correctTypeAndNums[0];
	if (arrowLoaded) {
		hint.appendChild(arrow);
		hint.appendChild(document.createElement('br'));
	}
	hint.appendChild(span);
	letters[letterIdx].appendChild(hint);
	// Update choices
	$('#choices').innerHTML = '';
	for (let i=0; i<choices2.length; i++) {
		const div = document.createElement('div');
		div.classList.add('choice');
		div.innerText = digitToHumber(choices2[i][1]) + ' = ' + choices2[i][0];
		div.addEventListener('mouseover', e => {
			div.classList.add('highlight');
		});
		div.addEventListener('mouseout', e => {
			div.classList.remove('highlight');
		});
		div.addEventListener('click', e => {
			if (choices2[i][0] == word[letterIdx]) {
				letters[letterIdx].innerText = choices2[i][0];
				letterIdx++;
				if (letterIdx == word.length) {
					const bdiv = document.createElement('div');
					bdiv.classList.add('new-word-div');
					const button = document.createElement('button');
					button.innerText = 'New word';
					button.classList.add('new-word-button');
					bdiv.appendChild(button);
					$('#word').appendChild(bdiv);
					button.addEventListener('click', e => {
						e.preventDefault();
						letterIdx = 0;
						beginNewWord();
					});
				} else {
					nextLetter();
				}
			} else {
				div.classList.add('wrong');
				setTimeout(() => {
					div.classList.remove('wrong');
				}, 500);
			}
		});
		$('#choices').appendChild(div);
	}
}

function beginNewWord() {
	$('#word').innerHTML = '';
	word = randArrElt(words);
	letters = [];
	for (let i=0; i<word.length; i++) {
		const letterDiv = document.createElement('div');
		letterDiv.classList.add('letter');
		letters.push(letterDiv);
		$('#word').appendChild(letterDiv);
	}
	nextLetter();
}

window.addEventListener('load', e => {
	arrow = document.createElement('img');
	arrow.src = 'image/arrow.png';
	arrow.width = 20;
	arrow.addEventListener('load', e => {
		arrowLoaded = true;
	});
	fetch('data/words.txt')
	.then(resp => resp.text())
	.then(text => {
		words = text.split('\n');
		beginNewWord();
	})
	.catch(err => alert(err));
});
