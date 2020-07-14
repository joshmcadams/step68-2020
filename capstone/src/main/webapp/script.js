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
  const incorrect = document.querySelector('#wrong');
  const response = document.querySelector('#right');
  const choices = document.querySelector('#welcome_question');
  const submit = document.querySelector('#submit');
  const answer = document.querySelector('#answer');
  invisibleText(incorrect);
  invisibleText(choices);
  invisibleText(submit);
  invisibleText(answer);
  visibleText(response);
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
      // TODO: Add User ID so they can only submit once.
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
    " your preference as to which one you want to use." + 
    /*" Check out this looping statement below written in JavaScript!" + 
    " Var number equals zero. For i equals 0, i is less than three, i plus plus." + 
    " Number plus plus. Console dot write line, current number: number." + 
    " Console dot write line, final number: number." + 
    " Step-by-Step Guide into Looping" + 
    " Line One: The number variable is created to store the value of an integer." + 
    " Line Two: This function uses a for loop. A for loop has three required items" + 
    " within its parenthesis: a counter variable, a conditional statement, and an incrementer/decrementer." + 
    " The i equals zero creates the counter variable for the loop. The i less than three is the conditional" + 
    " statement. If i is less than three, than it will run the for loop, or else it moves to line six." + 
    " The i plus plus is the incrementer for the loop. Once the for loop runs through each line within itself," + 
    " it keeps incrementing the i counter and runs lines three and four until the conditional statement is false." + 
    " Line Three: The number plus plus line adds one to the total of the variable number." + 
    " Line Four: The console dot write line current number: number line is a print statement." + 
    " What this means is that the page will display whatever is inside of the parenthesis." +  
    " Since number is an integer variable, the page will print the value of the variable at its certain point." + 
    " So in this case, the page will print, current number: the value of number." + 
    " Line Five: The curly bracket encloses the for loop." + 
    " Line Six: Once the for loop has ran three times, it exits the loop" + 
    " then displays the final number with the console dot write line," + 
    " final number, number statement." + */
    " This was just a basic loop, as looping can become very complex and confusing!" + 
    " Getting the basics of looping down early will help you when it comes to looping through" + 
    " complex problems!";

  // Required for the API to work
  const apiKey = "4049baf24b6f40e6bc894a213b0e700a";
  const voiceLink = "http://api.voicerss.org/";

  // Parameter variables from the API
  var language = document.querySelector("#lang").value;
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
}

/**
 * Makes item visible.
 */
function visibleText(item){
  item.style.visibility = 'visible';
  item.style.display = 'block';
}