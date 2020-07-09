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
      'title': 'Looping Answers',
      'width': 550,
      'height': 500,
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

/** Displays login button when user is not signed in. */
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
  codeEditor();
  slideIndex = 1;
  showSlides(slideIndex);
}

/** 
 * Give up response to dropdown question on welcome page
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
 * Makes item invisible
 */
function invisibleText(item){
  item.style.visibility = 'hidden';
  item.style.display = 'none';
}

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
  let unauth = document.querySelector('#unauth');
  fetch('/authstatus', {
    method: 'GET',
  }).then(function (response) {
    if (response.ok) {
      document.querySelector("#loginLink").innerHTML = "Logout";
      for (let item of dataContainer) {
       item.style.visibility = 'visible';
       item.style.display = 'block'; 
      }
      unauth.style.visibility = 'hidden';
      unauth.style.display = 'none';
      getDataUsingAsyncAwait();
    }
    else {
      document.querySelector("#loginLink").innerHTML = "Login";  
      for (let item of dataContainer) {
        item.style.visibility = 'hidden';
        item.style.display = 'none'; 
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
    unauth.style.visibility = 'hidden';
    unauth.style.display = 'none';
    });
  codeEditor();
  slideIndex = 1;
  showSlides(slideIndex);
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
 * Responds to dropdown question on welcome page
 */
function techAnswer(){
  const incorrect = document.querySelector('#wrong');
  visibleText(incorrect);
}

/**
 * Makes item visible
 */
function visibleText(item){
  item.style.visibility = 'visible';
  item.style.display = 'block';
}