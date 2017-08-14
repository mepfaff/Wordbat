var txt, highest;
var repeats = {};
var displayMax = 100;

// on document ready
$(function() {
  // new quill editor
  var quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write something...",
    scrollingContainer: "main"
  }); // end new quill

  // set initial contents
  quill.setText("Write write something here...");

  // test button to do
  $(".navbar-brand").click(function() {
    // format text and split into a sorted array
    txt = quill
      .getText() // gets text from quill editor
      .toLowerCase() // replaces all that's not letters, numbers, spaces, and apostrophes with a single space
      .replace(/[^a-z'\s\d]/g, " ") // replaces multiple spaces with a single space
      // todo: can you change this from "one or more" to "more than one"?
      .replace(/\s+/g, " ")
      .trim() // removes space from beginning and end
      .split(" ") // splits string into array
      .sort(); // sorts the array in-place

    console.log(txt);
    beginRepeatCheck();
    return;
  });

  $(".test-btn").click(function() {
    $(".repeats").empty();
  });

  // toggles display of menu items
  $(".toggle").click(function() {
    var closedCaret = $(this).find(".fa-caret-right");
    var openCaret = $(this).find(".fa-caret-down");
    var details = $(this).next(".option-details")
    
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
var setDisplay = function(element, onDisplay){
  if (element.css("display") === onDisplay){
    element.css("display", "none");
  }
  else element.css("display", onDisplay);

}

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

// to do: on checking a checkbox next to a repeated word
// add that word to the list of highlighted words
// highlight all instances of that word in quill editor

// to do: on ignoring a word
// add it to list of ignored words
// remove it from the display
// get and display the next word from the list of repeats

/* note to self: how will highlighting, display, and repeat checks adapt as user makes changes to the text? Which user preferences (such as which words to highlight) will be saved between repeat checks? */