var txt, highest, quill;
var repeats = {};
var displayMax = 100;
var ignore = [];
var common = [];

// on document ready
$(function() {
  // to do: have a function populate options if the user's been here before, then set those options

  // new quill editor
  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write something...",
    scrollingContainer: "main"
  }); // end new quill

  // set initial contents
  quill.setText(
    "Harry Potter and the Sorcerer's Stone CHAPTER ONE THE BOY WHO LIVED Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense. Mr. Dursley was the director of a firm called Grunnings, which made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time craning over garden fences, spying on the neighbors. The Dursleys had a small son called Dudley and in their opinion there was no finer boy anywhere. The Dursleys had everything they wanted, but they also had a secret, and their greatest fear was that somebody would discover it. They didn't think they could bear it if anyone found out about the Potters."
  );

  // populate ignore
  populateIgnore();

  // test button to do
  $(".navbar-brand").click(function() {
    // format text and split into a sorted array
    getTxt();
    onEdit();

    beginRepeatCheck();
    return;
  });

  $(".test-btn").click(function() {
    loadMostCommon();
    
   // quill.setContents([
    //  {insert: "hello", {background: '#abc' }}
//]);
    
    
          /*$(".ql-editor p").html().replace(toHighlight, "<span class='highlight0'>"+toHighlight+"</span>");;
    $(".ql-editor p").html(t);*/
          
 
    
    
   // console.log(t);
   
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


getTxt = function(){
	txt = quill
      .getText() // gets text from quill editor
      .toLowerCase() // lower case
      // replaces all that's not letters, numbers, spaces, and apostrophes with a single space
      .replace(/[^a-z'-\s\d]/g, " ")
      // replaces double hypens and hyphens with spaces on either side and ' with spaces on either side with a space
      .replace(/-{2,}|-(?=\s)|\s-|\s'+\s/g, " ")
      // replaces 2 or more spaces with a single space
      .replace(/\s{2,}/g, " ")
      .trim() // removes space from beginning and end
      .split(" ") // splits string into array
      .sort(); // sorts the array in-place
}
 


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
  
  // check how many words to ignore
    // to do: check load most common (if common === undefined then load most common, etc)
  
  // get how many most common to ignore (remove non-digits and convert to number)
  var rank = Number($(".rank").text().replace(/[^\d]/g, ""));
   
  // set maximum rank
  if (rank > 4350) rank = 4350;

  console.log(rank);
  
  
  displayRepeats(rank);
}; // end beginRepeatCheck

// recursively checks sorted array for duplicates, returns duplicate count
var check = function(c, count) {
  // if duplicate found, keep searching
  if (txt[c] === txt[c + 1]) count = check(c + 1, count);
  // count increases on each iteration of check (minimum 1)
  // to do I know this could be one line
  count++;
  return count;
}

// to do when editor is changed
var onEdit = function(){
  
  // update word count TODO fix this
  console.log(txt);
  updateWordCount();
  
}


// gets word count and updates display
var updateWordCount = function(){
  $(".count").text(txt.length); 
  var text = quill.getText();
  $(".chars").text(text.replace(/\s/g,"").split("").length);  
  $(".chars-with-spaces").text(text.split("").length - 1); 
}

// displays repeats in the results box
var displayRepeats = function(rank) {
  
  // destroy tooltips
  $('[data-toggle="tooltip"]').tooltip("destroy");
  
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
        
        // check if word should be ignored
        if (checkMostCommon(wordArr[j], rank) && checkIgnored(wordArr[j]))
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
  
  // turn on tooltips
  $('[data-toggle="tooltip"]').tooltip({container: "body"});
  
  return;
}; // end displayRepeats

// display the words
function display(word, count) {
  // to do: get from the page how many results to display

  // get and check against ignored words and most common words

  var newWord =
    '<div class="checkbox word"><label><input type="checkbox" value="">' +
    word +
    ": " +
    count +
    '</label><a href="#"><i class="fa fa-times-circle ignore-btn" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Ignore"></i></a></div>';

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
  common = [];
  var sample = "brown,fox\nthe\ndog";
  
  // replace newlines and 2+ spaces with single space and split along spaces
  // to do: store this info permanently and remove this step
  var arr = sample.toLowerCase().replace(/[\r\n]/g, " ").replace(/\s{2,}/g, " ").split(" ");
    
  // iterate through most common words
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var word = arr[i];
    
    // check if UK equiv
    if (word.indexOf(",") >= 0){
      
      console.log("Before: "+word);
      var tmpArr = word.split(",");
      console.log("After: "+tmpArr);
      common.push(tmpArr);
      
    } else common.push(arr[i]);
  } // end i for loop
  
  console.log(common);

} // end loadMostCommon

// check against most common words
var checkMostCommon = function(word, rank){
  
  // iterate through rank most common words
  for (var i = 0; i < rank; i++){
    
    var commonWord = common[i];
   
    // check if there's a UK equivalent
    if (Array.isArray(commonWord)){
      
      // check the word against US and UK variants
      for (var j = 0; j < commonWord.length; j++){
        if (word === commonWord[j])
          return false;
      }  
      // check if word is in n most common
    } else if (word === commonWord)
      return false;
  }
  return true;
}  

var checkIgnored = function(word){
  // to do
  return true;
}


  



// to do: on checking a checkbox next to a repeated word
// add that word to the list of highlighted words
// highlight all instances of that word in quill editor

// to do: on ignoring a word
// add it to list of ignored words
// remove it from the display
// get and display the next word from the list of repeats

/* note to self: how will highlighting, display, and repeat checks adapt as user makes changes to the text? Which user preferences (such as which words to highlight) will be saved between repeat checks? */