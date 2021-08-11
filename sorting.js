// ------------------------------------------------------------------------------
//  Drawing Operations
// ------------------------------------------------------------------------------
// Setup function
// Creates the canvas and starts the manager to initialize all states.
function setup() {
	// Create canvas of size 910 px by 3600 px.
	createCanvas(910, 3600);

	// Adjust the frame rate to slow down the refresh process.
	frameRate(2);

	// Setup the manager and initialize all states.
	setupManager();
}

// Draw function
// Draws all things to the screen.
function draw() {
	// Main title header of Sorting Race.
	textSize(30);
	fill(0, 255, 0);
	text('Sorting Race', 360, 27);

	// Smaller headings for each of the sorts.
	textSize(25);
	fill(0);
	text('Pore Sort', 82, 57);
	text('Merge Sort', 387, 57);
	text('Quick Sort', 692, 57);

	// Draw the grid tables onto the screen.
	drawTable(5, 65);
	drawTable(310, 65);
	drawTable(615, 65);

	// Draw each row assuming they exist for that row.
	// Skip if the sort ended before this.
	for(var i = 0; i < numRounds; i++) {
		if(i < poreResults.length) {
			drawRow(poreResults[i], 10, 84 + 23 * i, poreColors[i]);
		}
		if(i < mergeResults.length) {
			drawRow(mergeResults[i], 315, 84 + 23 * i, mergeColors[i]);
		}
		if(i < quickResults.length) {
			drawRow(quickResults[i], 620, 84 + 23 * i, quickColors[i]);
		}
	}	

	// Run one step of the manager.
	runManager();

	// End the refreshing when all states are done.
	if(mergeSortState === null && poreSortState === null && quickSortState === null) {
		noLoop();
	}
}

// Draw Table Function
// Draws a grid of size of 150 rows by 12 items.
// Each item is 22 x 22 pixels in size.
function drawTable(initX, initY) {
	for(var j = 0; j < 150; j++) {
		for(var i = 0; i < 12; i++) {
			fill(255);
			square(initX + 23 * i, initY + 23 * j, 22);
		}
	}
}

// Draw Row Function
// Draw each individual row one a time with the specified values and colors.
function drawRow(arr, initX, initY, arrColors) {
	textSize(20);
	for(var i = 0; i < 12; i++) {
		// Determine the color based on the state.
		// K means black, R means red, and B means blue.
		// Then draw the word onto the screen (hex value).
		if(arrColors[i] == 'k') {
			fill(0, 0, 0);
		}
		else if(arrColors[i] == 'r') {
			fill(255, 0, 0);
		}
		else if(arrColors[i] == 'b') {
			fill(0, 0, 255);
		}
		text(arr[i].toString(16), initX + i * 23, initY);
	}
}

// ------------------------------------------------------------------------------
//  General Manager Operations
// ------------------------------------------------------------------------------
// Testing array given by the project description.
var testArray = [
  [0x0, 0x5, 0xA, 0x6, 0x2, 0x7, 0xB, 0x2, 0xB, 0x6, 0x0, 0x3],
  [0x0, 0x6, 0x5, 0x6, 0x6, 0x7, 0x1, 0x0, 0x4, 0x0, 0xB, 0xA],
  [0x0, 0x6, 0x8, 0x4, 0xB, 0x8, 0x9, 0x3, 0x5, 0x7, 0x5, 0x4],
  [0x0, 0x7, 0x9, 0xA, 0x2, 0x1, 0x8, 0x3, 0x4, 0xB, 0x6, 0x5],
  [0x0, 0x9, 0x4, 0x8, 0x7, 0x8, 0x6, 0x2, 0x2, 0x6, 0x1, 0x6],
  [0x1, 0xA, 0xB, 0x3, 0x4, 0x7, 0x9, 0x0, 0x5, 0x2, 0x8, 0x6],
  [0x2, 0x8, 0x6, 0x1, 0x0, 0x3, 0x4, 0x2, 0x7, 0x8, 0x5, 0x9],
  [0x3, 0x0, 0x5, 0x3, 0x0, 0x4, 0x7, 0x8, 0x6, 0xA, 0x2, 0x1],
  [0x3, 0x2, 0x8, 0x4, 0x7, 0x6, 0x5, 0x1, 0x0, 0xB, 0xA, 0x9],
  [0x3, 0x4, 0x2, 0x7, 0x5, 0x6, 0x1, 0x8, 0x9, 0x0, 0xB, 0xA],
  [0x4, 0x1, 0xB, 0x3, 0x8, 0x2, 0x6, 0x2, 0x1, 0x9, 0x8, 0x5],
  [0x4, 0x6, 0x3, 0x7, 0x9, 0x0, 0x1, 0x5, 0xB, 0x8, 0xA, 0x2],
  [0x5, 0x3, 0x5, 0x1, 0xA, 0x3, 0x3, 0xA, 0x9, 0x9, 0xB, 0xB],
  [0x5, 0x9, 0x3, 0x4, 0x7, 0x9, 0x0, 0x8, 0x8, 0xA, 0x1, 0x5],
  [0x5, 0x9, 0xA, 0x2, 0x2, 0xA, 0x4, 0x4, 0xA, 0x3, 0x9, 0x4],
  [0x7, 0x1, 0x9, 0x2, 0x0, 0x6, 0x8, 0xB, 0x3, 0x4, 0x5, 0xA],
  [0x7, 0x2, 0xB, 0x3, 0xA, 0x5, 0x4, 0x1, 0x6, 0x9, 0x8, 0x0],
  [0x8, 0x1, 0xA, 0x3, 0x9, 0x2, 0x0, 0x1, 0x0, 0xA, 0x9, 0x1],
  [0x8, 0x9, 0x4, 0x0, 0xA, 0x5, 0x2, 0xB, 0x1, 0x6, 0x3, 0x7],
  [0xA, 0x6, 0x9, 0x3, 0x5, 0x4, 0x2, 0xB, 0x7, 0x0, 0x1, 0x8],
  [0xA, 0x9, 0x4, 0x2, 0x5, 0xB, 0x1, 0x6, 0x8, 0x7, 0x3, 0x0],
  [0xA, 0xA, 0x0, 0x2, 0x3, 0xB, 0x7, 0x2, 0x3, 0x5, 0x6, 0x4],
  [0xB, 0x4, 0x0, 0x1, 0x6, 0x3, 0x8, 0xA, 0x2, 0x9, 0x7, 0x5],
  [0xB, 0x5, 0x8, 0x6, 0x1, 0x7, 0x9, 0x2, 0xA, 0x4, 0x0, 0x3]];

// Each row of arrays in the results.
var mergeResults = [];
var poreResults = [];
var quickResults = [];

// Each row of colors used in the results.
var mergeColors = [];
var poreColors = [];
var quickColors = [];

// States for each sort method and the number of rounds used.
var mergeSortState, poreSortState, quickSortState;
var numRounds = 0;

// SetupManager Function
// Setup the entire state system for each sort operation.
function setupManager() {
	// Obtain one random array from the given array above.
	var arr = getRandomArray();

	// Initialize all states.
	mergeSortState = initMergeSort(createDeepCopy(arr));
	poreSortState = initPoreSort(createDeepCopy(arr));
	quickSortState = initQuickSort(createDeepCopy(arr));

	// Initialize the merge results with the starting array.
	mergeResults.push(createDeepCopy(mergeSortState["array"]));
	poreResults.push(createDeepCopy(poreSortState["array"]));
	quickResults.push(createDeepCopy(quickSortState["array"]));

	// Initialize the colors to start with all black.
	mergeColors.push(mergeSortState["arrColors"]);
	poreColors.push(poreSortState["arrColors"]);
	quickColors.push(quickSortState["arrColors"]);

	// Move to the next round.
	numRounds++;
}

// RunManager Function
// Runs one step for each sort if it is not already done.
function runManager() {
	// If MergeSort is still going step() once then push results if not null.
	if(mergeSortState !== null) {
		mergeSortState = step(mergeSortState);
		if(mergeSortState !== null) {
			mergeResults.push(createDeepCopy(mergeSortState["array"]));
			mergeColors.push(mergeSortState["arrColors"]);
		}
	}

	// If PoreSort is still going step() once then push results if not null.
	if(poreSortState !== null) {
		poreSortState = step(poreSortState);
		if(poreSortState !== null) {
			poreResults.push(createDeepCopy(poreSortState["array"]));
			poreColors.push(poreSortState["arrColors"]);
		}
	}

	// If QuickSort is still going step() once then push results if not null.
	if(quickSortState != null) {
		quickSortState = step(quickSortState);
		if(quickSortState != null) {
			quickResults.push(createDeepCopy(quickSortState["array"]));
			quickColors.push(quickSortState["arrColors"]);
		}
	}

	// Move to the next round.
	numRounds++;
}

// Step Function
// Takes one step by using the defined action function() given.
// Then returns that new state.
function step(state) {
	state["arrColors"] = ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'];
	var newState = state.action(state);
	return newState;
}

// GetRandomArray Function
// Choose one array from the list above randomly.
function getRandomArray() {
	return testArray[Math.floor(Math.random() * testArray.length)];  
}

// Swap Function
// Swaps two values in array arr at positions i,j.
function swap(arr, i, j) {
	var temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

// CreateDeepCopy Function
// Creates an exact duplicate of this array so that it cannot change previous array states.
function createDeepCopy(arr) {
	newArr = new Array(arr.length);
	for(i = 0; i < arr.length; i++) {
		newArr[i] = arr[i];
	}	
	return newArr;
}

// GetMinimum Function
// Determine which is smaller (val1 or val2) and return it.
function getMinimum(val1, val2) {
	if(val1 < val2) {
		return val1;
	}
	else {
		return val2;
	}
}

// ------------------------------------------------------------------------------
//  Pore Sort
// ------------------------------------------------------------------------------
// Initialize the PoreSort
// Initialization always starts with array (array to be sorted), action (the 
// function to move to next), and arrColors (colors of each hex value in the 
// array).  Then other state information include variables that are passed
// between functions. Return this state at the end.
function initPoreSort(arr) {
	state = {"i": 0, 
		 "array": arr, 
		 "action": poreFirstLoop, 
		 "arrColors": ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k']};
	return state;
}

// FirstLoop State
// This one deals with having to check if can proceed to the odd indexes.
// If we are at the end of this 1st pass, then move to poreSecondLoop state.
// Otherwise we stay on this track and move forward (and swap if needed using
// PoreFirstSwap state to swap them and show to the screen).
function poreFirstLoop(state) {
	// Check if we're at the end of this check.
	if(state["i"] >= state["array"].length) {
		state["i"] = 1;
		state["action"] = poreSecondLoop;
		return poreSecondLoop(state);
	}

	// Otherwise we consider swapping and do so if needed.
	let arr = state["array"];
	let i = state["i"];
	if(arr[i] > arr[i+1]) {
		state["action"] = poreFirstSwap;
		state["arrColors"][i] = 'r';
		state["arrColors"][i+1] = 'r';
	}
	else {
		state["action"] = poreFirstLoop;
		state["arrColors"][i] = 'r';
		state["arrColors"][i+1] = 'r';
		state["i"] = state["i"] + 2;
	}
	return state;
}

// FirstLoop State
// This one deals with having to check if can proceed to the end (dirty bit checked).
// If we are at the end of this 2nd pass, then check if dirty otherwise poreFirstLoop state.
// Otherwise we stay on this track and move forward (and swap if needed using
// PoreSecondSwap state to swap them and show to the screen).
function poreSecondLoop(state) {
	// Check if we're at the end of this check.
	if(state["i"] >= state["array"].length) {
		// Check if was dirty in this round, if so then restart poreFirstLoop.
		if(state["dirty"]) {
			state["i"] = 0;
			state["dirty"] = false;
			state["action"] = poreFirstLoop;
			return poreFirstLoop(state);
		}
		else {
			return null;
		}
	}

	// Otherwise we consider swapping and do so if needed.
	let arr = state["array"];
	let i = state["i"];
	if(arr[i] > arr[i+1]) {
		state["action"] = poreSecondSwap;
		state["arrColors"][i] = 'r';
		state["arrColors"][i+1] = 'r';
	}
	else {
		state["action"] = poreSecondLoop;
		state["arrColors"][i] = 'r';
		state["arrColors"][i+1] = 'r';
		state["i"] = state["i"] + 2;
	}
	return state;
}

// PoreFirstSwap State
// Shows the swapping in the FirstLoop state.
function poreFirstSwap(state) {
	// Swap the value.
	let arr = state["array"];
	swap(arr, state["i"], state["i"] + 1);
	state["array"] = arr;

	// Setup dirty bit to true.
	state["dirty"] = true;

	// Color these values as changed.
	state["arrColors"][state["i"]] = 'b';
	state["arrColors"][state["i"] + 1] = 'b';

	// Update and move back to the first loop.
	state["i"] = state["i"] + 2;
	state["action"] = poreFirstLoop;
	return state;
}

// PoreSecondSwap State
// Shows the swapping in the SecondLoop state.
function poreSecondSwap(state) {
	// Swap the value.
	let arr = state["array"];
	swap(arr, state["i"], state["i"] + 1);
	state["array"] = arr;

	// Setup dirty bit to true.
	state["dirty"] = true;

	// Color these values as changed.
	state["arrColors"][state["i"]] = 'b';
	state["arrColors"][state["i"] + 1] = 'b';

	// Update and move back to the second loop.
	state["i"] = state["i"] + 2;
	state["action"] = poreSecondLoop;
	return state;
}

// ------------------------------------------------------------------------------
//  Quick Sort
// ------------------------------------------------------------------------------
// Initialize the QuickSort
// Initialization always starts with array (array to be sorted), action (the 
// function to move to next), and arrColors (colors of each hex value in the 
// array).  Then other state information include variables that are passed
// between functions. Return this state at the end.
function initQuickSort(arr) {
	state = {"array": arr, 
		 "l": 0,
		 "h": arr.length - 1,
		 "stack": [0, arr.length - 1],
		 "action": quicksort, 
		 "arrColors": ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k']};
	return state;
}

// Quicksort State
// This is an Iterative Form of the QuickSort that runs in O(N log N) time.
// This method is preferred over the recursive one because it is easier to implement
// when it is iterative rather than recursive to maintain state.
function quicksort(state) {
	// If we have reached the end of the stack,
	// that means there are no more lengths of arrays to look at.
	// Otherwise we setup for the quicksort and call Partition State.
	if(state["stack"].length > 0) {
		state["h"] = state["stack"].pop();
		state["l"] = state["stack"].pop();
		state["pivot"] = state["array"][state["h"]];
		state["i"] = state["l"] - 1;
		state["j"] = state["l"];
		state["action"] = partition;
		return partition(state);
	}
	else {
		return null;
	}
}

// Partition State
// Used to partition the state information by comparing the j-th item
// to the pivot and seeing if they need to move.  If so it moves to the
// PartitionSwap state, otherwise continues in this state.
function partition(state) {
	if(state["j"] <= state["h"] - 1) {
		// Color these states as red as comparing them.
		state["arrColors"][state["j"]] = 'r';
		state["arrColors"][state["pivot"]] = 'r';

		// If j-th item is less than pivot, swap them.
		// Otherwise move forward.
		if(state["array"][state["j"]] <= state["pivot"]) {
			state["i"] = state["i"] + 1;
			state["action"] = partitionSwap;
		}
		else {
			state["j"] = state["j"] + 1;
		}
		return state;
	}
	else {
		// After reaching the end, the postPartitionSwap is done.
		state["action"] = postPartitionSwap;
		return postPartitionSwap(state);
	}
}

// PartitionSwap State
// Shows the swapping in the Partition state.
function partitionSwap(state) {
	// Swap the value.
	var arr = state["array"];
	swap(arr, state["i"], state["j"]);
	state["array"] = arr;

	// Color these values as changed.
	state["arrColors"][state["i"]] = 'b';
	state["arrColors"][state["j"]] = 'b';

	// Update and move back to the partition loop.
	state["j"] = state["j"] + 1;
	state["action"] = partition;
	return state;
}

// PostPartitionSwap State
// Shows the swapping in the PostPartition state.
function postPartitionSwap(state) {
	// Swap the value.
	var arr = state["array"];
	swap(arr, state["i"] + 1, state["h"]);
	state["array"] = arr;

	// Color these values as changed.
	state["arrColors"][state["i"] + 1] = 'b';
	state["arrColors"][state["h"]] = 'b';

	// Update and move back to the partition loop.
	state["p"] = state["i"] + 1;
	state["action"] = setupPartition;
	return state;
}

// SetupPartition State
// Determines if there are new smaller segments of the array
// that need to be called with quick sort.  If so, add them to the
// stack. Then move to the next quicksort phase.
function setupPartition(state) {
	// See if left side needs to be pushed.
	if(state["p"] - 1 > state["l"]) {
		state["stack"].push(state["l"]);
		state["stack"].push(state["p"] - 1);
	}

	// See if right side needs to be pushed.
	if(state["p"] + 1 < state["h"]) {
		state["stack"].push(state["p"] + 1);
		state["stack"].push(state["h"]);
	}

	// Go back to the quicksort state after this.
	state["action"] = quicksort;
	return quicksort(state);
}

// ------------------------------------------------------------------------------
//  Merge Sort
// ------------------------------------------------------------------------------
// Initialize the MergeSort
// Initialization always starts with array (array to be sorted), action (the 
// function to move to next), and arrColors (colors of each hex value in the 
// array).  Then other state information include variables that are passed
// between functions. Return this state at the end.
function initMergeSort(arr) {
	state = {"n": arr.length, 
		 "array": arr, 
		 "currSize": 1,
		 "left": 0,
		 "action": mergeSortOuter, 
		 "arrColors": ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k']};
	return state;
}

// MergeSortOuter State
// State that is looking at the size of the currSize to the array.
// When the entire loop is combined, it is finished.
function mergeSortOuter(state) {
	if(state["currSize"] <= state["n"]-1) {
		state["left"] = 0;
		state["action"] = mergeSortInner;
		return mergeSortInner(state);
	}
	else {
		return null;
	}
}
	
// MergeSortOuter State
// State that is looking at each grouping of currSize elements in the array.
// When all groupings are looked at, it is finished.
function mergeSortInner(state) {
	// If it is finished, then go back to the MergeSortOuter to update
	// the merging size by a factor of 2.  Otherwise parse the arrays
	// with objects of size currSize.
	if(state["left"] < state["n"]-1) {
		state["mid"] = getMinimum(state["left"] + state["currSize"] - 1, state["n"] - 1);
		state["right"] = getMinimum(state["left"] + 2 * state["currSize"] - 1, state["n"] - 1);
		state["action"] = mergeLists;
		state["k"] = state["left"];
		state["i"] = state["left"];
		state["j"] = state["mid"] + 1;
		state["aux"] = createDeepCopy(state["array"]); 
		return mergeLists(state);
	}
	else {
		state["currSize"] = state["currSize"] * 2;
		state["action"] = mergeSortOuter;
		return mergeSortOuter(state);
	}
}

// MergeLists State
// Used to merge two sides together or if one side is done
// then it move onto only finishing the remaining of the other array.
function mergeLists(state) {
	if(state["i"] <= state["mid"] && state["j"] <= state["right"]) {
		state["action"] = mergeListsTogether;
		return mergeListsTogether(state);
	}
	else {
		state["action"] = mergeListLeft;
		return mergeListLeft(state);
	}
}

// MergeListsTogether State
// Used to take one item from the two non-empty sublists and put 
// it into the correct location.  Uses mergeListsTogetherI (for left
// array) and mergeListsTogetherJ (for right array) states when necessary.
function mergeListsTogether(state) {
	state["arrColors"][state["i"]] = 'r';
	state["arrColors"][state["j"]] = 'r';
	if(state["aux"][state["i"]] <= state["aux"][state["j"]]) {
		state["action"] = mergeListsTogetherI;
		return state;
	}
	else {
		state["action"] = mergeListsTogetherJ;
		return state;
	}
}

// MergeListsTogetherI State
// Used to take one item from the left sublist and put 
// it into the correct location.  
function mergeListsTogetherI(state) {
	state["array"][state["k"]] = state["aux"][state["i"]];
	state["arrColors"][state["k"]] = 'b';
	state["arrColors"][state["j"]] = 'r';
	state["i"] = state["i"] + 1;
	state["k"] = state["k"] + 1;
	state["action"] = mergeLists;
	return state;
}

// MergeListsTogetherJ State
// Used to take one item from the right sublist and put 
// it into the correct location.  
function mergeListsTogetherJ(state) {
	state["array"][state["k"]] = state["aux"][state["j"]];
	state["arrColors"][state["k"]] = 'b';
	state["arrColors"][state["i"]] = 'r';
	state["j"] = state["j"] + 1;
	state["k"] = state["k"] + 1;
	state["action"] = mergeLists;
	return state;
}

// MergeListLeft State
// Used to take one item from the non-empty left sublist and put 
// it into the correct location.  Uses mergeListLeftI (for left
// array moving).
function mergeListLeft(state) {
	if(state["i"] <= state["mid"]) {
		state["action"] = mergeListLeftI;
		return mergeListLeftI(state);
	}
	else {
		state["action"] = mergeListRight;
		return mergeListRight(state);
	}
}

// MergeListLeftI State
// Used to take one item from the left sublist and put 
// it into the correct location. Go to mergeListLeft after this.
function mergeListLeftI(state) {
	state["array"][state["k"]] = state["aux"][state["i"]];
	state["arrColors"][state["k"]] = 'b';
	state["arrColors"][state["i"]] = 'r';
	state["i"] = state["i"] + 1;
	state["k"] = state["k"] + 1;
	state["action"] = mergeListLeft;
	return state;
}

// MergeListRight State
// Used to take one item from the non-empty right sublist and put 
// it into the correct location.  Uses mergeListRightJ (for right
// array moving).
function mergeListRight(state) {
	if(state["j"] <= state["right"]) {
		state["action"] = mergeListRightJ;
		return mergeListRightJ(state);
	}
	else {
		state["left"] = state["left"] + 2 * state["currSize"];
		state["action"] = mergeSortInner;
		return mergeSortInner(state);
	}
}

// MergeListRightJ State
// Used to take one item from the right sublist and put 
// it into the correct location. Go to mergeListRight after this.
function mergeListRightJ(state) {
	state["array"][state["k"]] = state["aux"][state["j"]];
	state["arrColors"][state["k"]] = 'b';
	state["arrColors"][state["j"]] = 'r';
	state["j"] = state["j"] + 1;
	state["k"] = state["k"] + 1;
	state["action"] = mergeListRight;
	return state;
}