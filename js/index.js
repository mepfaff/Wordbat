var fontsize;
var txt;

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
  }); // end cilck text button
}); // end document ready function

function beginRepeatCheck(){
  
  // iterate through every word in the arrray
  var len = txt.length;
  for (var i=0; i < len; i++){
    
    // keep count of the ith word in txt array
    var count = 0;
    
    // keep track of which word we're comparing
    var current = i; 
    
    // check ith word for duplicates
    count = check(current, count);
    
    // to do 
    if (count > 1)
      console.log(txt[i]+": "+count);
    
    // move up to the next unique word
    i += (count - 1);
  }
  return;
} // end beginRepeatCheck

// recursively checks sorted array for duplicates, returns duplicate count
function check(c, count){
  
  // if duplicate found, keep searching
  if (txt[c] === txt[c+1])
    count = check(c+1, count);
  // count increases on each iteration of check (minimum 1)
  // to do I know this could be one line
  count++;
  return count;
}