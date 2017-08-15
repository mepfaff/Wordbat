var txt, highest;
var repeats = {};
var displayMax = 100;
var ignore = [];

// on document ready
$(function() {
  // to do: have a function populate options if the user's been here before, then set those options

  // new quill editor
  var quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write something...",
    scrollingContainer: "main"
  }); // end new quill

  // set initial contents
  quill.setText(
    "Harry Potter and the Sorcerer's Stone CHAPTER ONE THE BOY WHO LIVED Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense. Mr. Dursley was the director of a firm called Grunnings, which made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time craning over garden fences, spying on the neighbors. The Dursleys had a small son called Dudley and in their opinion there was no finer boy anywhere. The Dursleys had everything they wanted, but they also had a secret, and their greatest fear was that somebody would discover it. They didn't think they could bear it if anyone found out about the Potters. Mrs. Potter was Mrs. Dursley's sister, but they hadn't met for several years; in fact, Mrs. Dursley pretended she didn't have a sister, because her sister and her good-for-nothing husband were as unDursleyish as it was possible to be. The Dursleys shuddered to think what the neighbors would say if the Potters arrived in the street. The Dursleys knew that the Potters had a small son, too, but they had never even seen him. This boy was another good reason for keeping the Potters away; they didn't want Dudley mixing with a child like that. When Mr. and Mrs. Dursley woke up on the dull, gray Tuesday our story starts, there was nothing about the cloudy sky outside to suggest that strange and mysterious things would soon be happening all over the country. Mr. Dursley hummed as he picked out his most boring tie for work, and Mrs. Dursley gossiped away happily as she wrestled a screaming Dudley into his high chair. None of them noticed a large, tawny owl flutter past the window. At half past eight, Mr. Dursley picked up his briefcase, pecked Mrs. Dursley on the cheek, and tried to kiss Dudley good-bye but missed, 2 because Dudley was now having a tantrum and throwing his cereal at the walls."
  );

  // populate ignore
  populateIgnore();

  // test button to do
  $(".navbar-brand").click(function() {
    // format text and split into a sorted array
    txt = quill
      .getText() // gets text from quill editor
      .toLowerCase() // lower case
      // replaces all that's not letters, numbers, spaces, and apostrophes with a single space
      .replace(/[^a-z'\s\d]/g, " ")
      // replaces multiple spaces with a single space
      // todo: can you change this from "one or more" to "more than one"?
      .replace(/\s+/g, " ")
      .trim() // removes space from beginning and end
      .split(" ") // splits string into array
      .sort(); // sorts the array in-place

    beginRepeatCheck();
    return;
  });

  $(".test-btn").click(function() {
    loadMostCommon();
  });

  // toggles display of menu items
  $(".toggle").click(function() {
    var closedCaret = $(this).find(".fa-caret-right");
    var openCaret = $(this).find(".fa-caret-down");
    var details = $(this).next(".option-details");

    setDisplay(closedCaret, "inline");
    setDisplay(openCaret, "inline");
    setDisplay(details, "block");
  });
}); // end document ready function

/* setDisplay(element, onDisplay)
* Takes the element and the display property that
* it should have while on, and toggles that display 
* between that property and none
*/
var setDisplay = function(element, onDisplay) {
  if (element.css("display") === onDisplay) {
    element.css("display", "none");
  } else element.css("display", onDisplay);
};

// starts the process over for finding repeats
var beginRepeatCheck = function() {
  repeats = {};

  // display loading
  $(".repeats").html("Loading...");

  // keep track of the word with the highest count
  highest = 0;

  // iterate through every word in the arrray
  var len = txt.length;
  for (var i = 0; i < len; i++) {
    // keep count of the ith word in txt array
    var count = 0;

    // keep track of which word we're comparing
    var current = i;

    // check ith word for duplicates
    count = check(current, count);

    // update hightest count
    if (count > highest) highest = count;

    // store repeats in an array within an object with count as key
    if (count > 1) {
      // initialize the array if word is the first with its count
      if (repeats[count] === undefined) repeats[count] = [];

      // store the ith word in repeats[count]
      repeats[count].push(txt[i]);
    } // end of count > 1

    // move up to the next unique word
    i += count - 1;
  } // end for loop

  displayRepeats();
}; // end beginRepeatCheck

// recursively checks sorted array for duplicates, returns duplicate count
function check(c, count) {
  // if duplicate found, keep searching
  if (txt[c] === txt[c + 1]) count = check(c + 1, count);
  // count increases on each iteration of check (minimum 1)
  // to do I know this could be one line
  count++;
  return count;
}

// to do
var displayRepeats = function() {
  // clear box
  $(".repeats").empty();

  // keep track of total displayed
  var total = 0;

  // iterate from highest to lowest repeat count
  for (var i = highest; i > 1; i--) {
    // check to see if that count has words stored in it
    if (repeats.hasOwnProperty(i)) {
      // get each word from the stored array
      var wordArr = repeats[i];

      // list all words in that array
      var arrLen = wordArr.length;
      for (var j = 0; j < arrLen; j++) {
        display(wordArr[j], i);

        // stop displaying words after max
        total++;
        if (total > displayMax - 1) {
          j = arrLen;
          i = 1;
        }
      } // end j for loop
    } // end if hasownproperty
  } // end i for loop
  return;
}; // end retrieveRepeats

// display the repeats
function display(word, count) {
  // to do: get from the page how many results to display

  // get and check against ignored words and most common words

  var newWord =
    '<div class="checkbox word"><label><input type="checkbox" value="">' +
    word +
    ": " +
    count +
    "</label></div>";

  // display the word in the list of repeats
  $(".repeats").append(newWord);
}

var populateIgnore = function() {
  // to do: check if user has ignored words saved already or "n most common" set to a number other than default
  //
};


// to do have these words loaded in from txt file
/*
* Takes a list of newline-separated words and turns them into an array. Words with a british spelling formatted like "us,uk" will become their own array within the list.
*/
var loadMostCommon = function() {
  
  // get sample data
  var sample = "the,be\nand\nof\n\n";
  
  // get how many to ignore (remove non-digits and convert to number)
  var rank = Number($(".rank").text().replace(/[^\d]/g, ""));
  console.log(rank);
  
  if (rank > 4350) rank = 4350;
  
  // replace newlines with spaces and split along spaces
  var text = sample.toLowerCase().replace(/[\r\n]/g, " ").split(" ");
  
  // list of most common words plus UK equivalents
  var commonWords = [];
  // iterate through rank most common words
  for (var i = 0; i < rank; i++) {
    var word = text[i];
    
    // if a word has a comma, it has a UK equivalent
    var commaIndex = word.indexOf(",");
    // put this in its own array (to keep rank)
    if (commaIndex < 0) commonWords.push(word);
    else {
      var arr = word.split(",");
      commonWords.push(arr);
    }
  }
  // note this doesn't work yet: figure out what to do with the array of uk words- is it even needed?
  // put these words on the ignored list
  var len = commonWords.length;
  for (var i = 0; i < commonWords.length; i++){
    ignore.push(commonWords[i]);
  }
  
  console.log(commonWords);
};

// to do: on checking a checkbox next to a repeated word
// add that word to the list of highlighted words
// highlight all instances of that word in quill editor

// to do: on ignoring a word
// add it to list of ignored words
// remove it from the display
// get and display the next word from the list of repeats

/* note to self: how will highlighting, display, and repeat checks adapt as user makes changes to the text? Which user preferences (such as which words to highlight) will be saved between repeat checks? */