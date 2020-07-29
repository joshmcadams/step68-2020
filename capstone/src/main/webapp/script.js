// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Packages/variables needed for certain APIs and functions
 */
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
var slideIndex;

/**
 * Code editor to put on page.
 */
function codeEditor() {
  var codeText = 
    "int number = 0;" + 
    "\nfor(int i=0; i<3; i++){" + 
    "\n  number++;" + 
    "\n  console.writeln(\"Current Number: \" + number);" + 
    "\n}" + 
    "\nconsole.writeln(\"Final Number: \" + number)";

  var myCodeEditor = CodeMirror.fromTextArea(document.querySelector('#js'), {
    autocorrect: true,
    lineNumbers: true,
    mode: "javascript",
    spellcheck: true,
    theme: "base16-dark",
    value: codeText
  });
}

/**
 * "Runs" the code in the looping code editor.
 */
function compile() {
  // Display the output of the code on the page
  document.querySelector('#code').style.visibility = 'visible';
  document.querySelector('#code').style.display = 'block';
}

/**
 * Deletes all the comments from the 'Comments' servlet.
 */
async function deleteDataUsingAsyncAwait() {
  // Retrieve the data from '/comments' and delete the comments from the admin page
  /* TODO: handle errors */
  const response = await fetch('/comments', {
    method: 'DELETE',
  });
  
  // Delete the data from the page
  const dataContainer = document.querySelector('#commentContainer');
  dataContainer.style.visibility = 'hidden';
  dataContainer.style.display = 'block';
  dataContainer.innerHTML = data;
}

/**
  * Fetches looping submissions and uses it to create a chart.
  */
function drawChart() {
  fetch('/looping').then(response => response.json())
  .then((loopAnswers) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Points');
    data.addColumn('number', 'Submissions');
    Object.keys(loopAnswers).forEach((points) => {
      data.addRow([points, loopAnswers[points]]);
    });

    const options = {
      'title': 'Looping Answers (First Attempt)',
      'width': 565,
      'height': 450,
      'backgroundColor': '#f4b400',
      'pieHole': 0.4,
    };

    const chart = new google.visualization.PieChart(
        document.querySelector('#chart-container'));
    chart.draw(data, options);
  });
  
  // Display the chart on to the page
  document.querySelector('#chart-container').style.visibility = 'visible';
  document.querySelector('#chart-container').style.display = 'block';
}

/**
  * Displays login button when user is not signed in.
  */
function displayLoginOption() {

 fetch('/login')
     .then(response=> response.json())
     .then(studentInfo=> {
     if (studentInfo.userId == null) {
        document.querySelector("#loginLink").innerHTML = "Login";
     } else {
        document.querySelector("#loginLink").innerHTML = "Logout";
     }
     })
     .catch((error) => {
         console.error(error);
         sessionStorage.setItem('logged-in','');
         displayLoginOption();
     });
}

/** 
 * Give up response to dropdown question on welcome page.
 */
function giveUp(){
  const response = document.querySelector('#right');
  if((document.querySelector("#wrong").style.visibility)!="hidden"){
    document.querySelector('#wrong').style.visibility = 'hidden';
  }
  visibleText(response);
  invisibleText(document.querySelector('#dropdownMenuButton'));
  invisibleText(document.querySelector('#answer'));
}

function hideMessage(){
    document.querySelector('#wrong').style.visibility = 'hidden';
}
/**
 * Hides the comment section (only works if logged in).
 */
function hideData() {
  document.querySelector('#commentContainer').style.visibility = 'hidden';
  document.querySelector('#commentContainer').style.display = 'none';
}

/**
 * Makes item invisible.
 */
function invisibleText(item){
  item.style.visibility = 'hidden';
  item.style.display = 'none';
}

/**
 * Logs user in then displays the correct text depending on login status.
 */
function login(){

  fetch('/login')
    .then(response=> response.json())
    .then(studentInfo=> {
      //If user has nickname then display it if not use their user id.
      const studentNickname = studentInfo.nickname || studentInfo.userId;
      sessionStorage.setItem('logged-in', studentNickname);
      window.location.href = studentInfo.logOutUrl;
    })
    .catch((error) => {
        console.error(error);
        sessionStorage.setItem('logged-in','');
        displayLoginOption();
    });
}

/**
 * Manages the visibility of certain content based on the login status of the user.
 */
function manageVisibility() {
  let dataContainer = document.querySelectorAll('.requiresauth');
  let slides = document.querySelectorAll('.loopSlides');
  let exp = document.querySelectorAll('.explanation');
  let slideButton = document.querySelectorAll('.slidebutton');
  let unauth = document.querySelector('#unauth');
  let firstExp = document.querySelector('#firstExp');
  let js = document.querySelector('#js');
  fetch('/authstatus', {
    method: 'GET',
  }).then(function (response) {
    if (response.ok) {
      document.querySelector("#loginLink").innerHTML = "Logout";
      for (let item of dataContainer) {
       item.style.visibility = 'visible';
       item.style.display = 'block'; 
      }
      for (let item of slides) {
       item.style.visibility = 'visible';
      }
      for (let item of exp) {
       item.style.visibility = 'visible';
      }
      for (let item of slideButton) {
       item.style.visibility = 'visible';
      }
      if (js != null && firstExp != null && firstSlide != null) {
        js.style.visibility = 'hidden';
        js.style.display = 'none';
        codeEditor();
        slideIndex = 1;
        showSlides(slideIndex);
      }
      unauth.style.visibility = 'hidden';
      unauth.style.display = 'none';
    }
    else {
      document.querySelector("#loginLink").innerHTML = "Login";  
      for (let item of dataContainer) {
        item.style.visibility = 'hidden';
        item.style.display = 'none'; 
      }
      for (let item of slides) {
       item.style.visibility = 'hidden';
       item.style.display = 'none';
      }
      for (let item of exp) {
       item.style.visibility = 'hidden';
       item.style.display = 'none';
      }
      for (let item of slideButton) {
        item.style.visibility = 'hidden';
        item.style.display = 'none';
      }
      if (js != null && firstExp != null && firstSlide != null) {
        firstSlide.style.visibility = 'hidden';
        firstSlide.style.display = 'none';
        firstExp.style.visibility = 'hidden';
        firstExp.style.display = 'none';
        js.style.visibility = 'hidden';
        js.style.display = 'none';
      }
      unauth.style.visibility = 'visible';
      unauth.style.display = 'block';
    }
  })
  .catch(function() { 
    for (let item of dataContainer) {
      item.style.visibility = 'hidden';
      item.style.display = 'none'; 
    }
    for (let item of slides) {
      item.style.visibility = 'hidden';
      item.style.display = 'none';
    }
    for (let item of exp) {
      item.style.visibility = 'hidden';
      item.style.display = 'none';
    }
    for (let item of slideButton) {
      item.style.visibility = 'hidden';
      item.style.display = 'none';
    }
    if (js != null && firstExp != null && firstSlide != null) {
      firstSlide.style.visibility = 'hidden';
      firstSlide.style.display = 'none';
      firstExp.style.visibility = 'hidden';
      firstExp.style.display = 'none';
      js.style.visibility = 'hidden';
      js.style.display = 'none';
    }
    unauth.style.visibility = 'hidden';
    unauth.style.display = 'none';
  });
}

/**
 * Adds or subtracts one to the slideIndex.
 */
function moveSlide(n) {
  showSlides(slideIndex += n);
}

/**
 * Shows the image with the given slideIndex and hides the other images.
 */
function showSlides(n) {
  var slides = document.querySelectorAll('.loopSlides');
  var exp = document.querySelectorAll('.explanation');
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    exp[i].style.display = 'none';
  }
  slides[slideIndex-1].style.display = 'block';
  exp[slideIndex-1].style.display = 'block';
}

/**
 * Shows if the answer is correct or not and submits it to the 'looping' servlet.
 */
async function submitAnswer() {
  // Posts the answer, and when it is done it updates the chart
  $.ajax({
    type: 'POST', url: '/looping', 
    data: {
      'points': document.querySelector('#selectpoints').value,
    },
  }).done(function(response) {
      drawChart();
  })

  const answer = document.querySelector('#selectpoints').value;
  const dropdown = document.querySelector('#dropdown');
  const right = document.querySelector('#right');
  const wrong = document.querySelector('#wrong');

  if (answer == 'eighteen') {
    visibleText(right);
    invisibleText(wrong);
    invisibleText(dropdown);
  }
  else {
    visibleText(wrong);
    invisibleText(right);
  }
}
/**
 * Adds the data from the Comments servlet using async/await (the return values are used directly), and converts it to a JSON.
 */
async function getDataUsingAsyncAwait() {
  // Retrieve the data from '/comments'
  /* TODO: handle errors */
  const response = await fetch('/comments');
  const data = await response.json();
  var text = "";
  for(i = 0; i < data.length; i++){
    text += "<b>" + "<i>" + data[i].commentText + "</i><br>";
  }

  // Add the data to the page
  const dataContainer = document.querySelector('#commentContainer');
  dataContainer.style.visibility = 'visible';
  dataContainer.style.display = 'block';
  dataContainer.innerHTML = text;
}

async function submitComment() {
  // Retrieve the data from '/comments'
  const data = {
      "commentInput": document.querySelector("#comment-input").value
  };
  const response = await fetch('/comments', {
    method: 'POST',
    body: JSON.stringify(data)
    });
     // Put the text on the page
  getDataUsingAsyncAwait();
}

/** 
 * Responds to dropdown question on welcome page.
 */
function techAnswer(){
  const incorrect = document.querySelector('#wrong');
  visibleText(incorrect);
}

/**
 * Converts textual content to audio content.
 */
async function textToVoice(){
  var loopingText = "I'm sure you've seen this symbol on many of your favorite websites and apps." + 
    " It keeps moving the smaller circle in a circular motion until something is loaded or we exit." + 
    " This is a prime example of looping! Looping allows us to do a certain task over and over and over" + 
    " (until we decide to stop it or it reaches a certain condition)." + 
    " We can also track what happens between each loop iteration!" + 
    " For example, let's track Stephen Curry's three-point attempts." + 
    " Everytime Stephen Curry shoots from behind the three-point line and scores," + 
    " he earns three points to his point total." + 
    " Stephen Curry currently has six points. He takes five three-point shots and makes four of them." + 
    " How many total points does Stephen Curry currently have?" + 
    " In Computer Science, the two most common types of looping statements are while" + 
    " loops and for loops." + 
    " While loops keep running a certain action while a certain condition" + 
    " is or is not met." + 
    " For loops keep running a certain action for a certain duration," + 
    " while internally keeping count of how many times it has ran with an iterator (or counter) variable." + 
    " Both of these looping statements are great to use, so it depends on" + 
    " your preference as to which one you want to use.";

  // Required for the API to work
  const apiKey = "4049baf24b6f40e6bc894a213b0e700a";
  const voiceLink = "http://api.voicerss.org/";
 
  // Parameter variables from the API
  var language = document.querySelector("#lang").value;
  var translate_code = language.substring(0,2);
  loopingText = translatetext(loopingText, translate_code);
  var fileType = "";
 
  // In case an mp3 file cannot be played on the user's browser
  if (document.querySelector("#audioPlayer") != null) {
    if (document.querySelector("#audioPlayer").canPlayType("audio/mpeg") != "")
      fileType = "mp3";
    else {
      fileType = "wav";
    }
  }
 
  // Putting the link together
  const loopingAudio = voiceLink + "?key=" + apiKey + "&r=0.5&hl=" + language + "&src=" + loopingText;
  document.querySelector("#audioPlayer").src = loopingAudio;
  visibleText(document.querySelector("#audioPlayer"));
}

/** 
 * Translates a given text
 */
function translatetext(text, language){
  // Creates POST method and stores in response
  const new_text = $.ajax({
    url: "/translate",
    type: 'POST',
    data: {
        text:text,
        language:language
        },
    async: false
  }).responseText;
 
  // Return translated text
  return new_text;
}

/**
 * Makes item visible.
 */
function visibleText(item){
  item.style.visibility = 'visible';
  item.style.display = 'block';
}
