var txt, highest;
var repeats = {};

// on document ready
$(function() {
  // new quill editor
  var quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write something...",
    scrollingContainer: "main"
  }); // end new quill

  // set initial contents
  quill.setText("Write something here...");

  // test button to do
  $(".navbar-brand").click(function() {
    // format text and split into a sorted array
    txt = quill
      .getText() // gets text from quill editor
      .toLowerCase()
      // replaces all that's not letters, numbers, spaces, and apostrophes with a single space
      .replace(/[^a-z'\s\d]/g, " ")
      // replaces multiple spaces with a single space
      // todo: can you change this from "one or more" to "more than one"?
      .replace(/\s+/g, " ")
      .trim() // removes space from beginning and end
      .split(" ") // splits string into array
      .sort(); // sorts the array in-place

    console.log(txt);
    beginRepeatCheck();
    displayRepeats();
  }); // end cilck text button
}); // end document ready function

function beginRepeatCheck() {
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
      if (repeats[count] === undefined) {
        repeats[count] = [];
      }

      // store the word in repeats[count]
      repeats[count].push(txt[i]);
    } // end of count > 1

    // move up to the next unique word
    i += count - 1;
  } // end for loop

  return;
} // end beginRepeatCheck

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
function displayRepeats() {
  // iterate from highest to lowest repeat count
  for (var i = highest; i > 1; i--) {
    // check to see if that count has words stored in it
    if (repeats.hasOwnProperty(i)) {
      // get each word from the stored array
      var wordArr = repeats[i];
      var len = wordArr.length;
      for (var j = 0; j < len; j++) {
        // display the word and its count
        display(wordArr[j], i);
      }
    }
  } // end i for loop
} // end retrieveRepeats

// display the repeats
function display(word, count){
  // to do: get from the page how many results to display
  
  // get and check against ignored words and most common words
  
  console.log(word+": "+count);
}