const addButton = document.getElementById("add-element");
const elContainer = document.getElementById("element-container");
const sectionMenu = document.getElementById("custom-menu");
const messageMenu = document.getElementById("message-menu");
let currentElementRightClicked = "";
let currentMessageRightClicked = "";

//checkboxes
const isQuestionCheckbox = document.getElementById("isQuestion");

//this button creates a new speech block
addButton.addEventListener("click", function(){
  let newEl = document.createElement("details");
  newEl.appendChild(document.createElement("summary"));
  newEl.querySelector("summary").innerHTML = "Untitled"
  newEl.classList.add("element")

  newEl.addEventListener("contextmenu", function(e){
    sectionMenu.style.display = "block";
    currentElementRightClicked = newEl;
    e.preventDefault();
  })

  elContainer.appendChild(newEl);
})

const jsonTextArea = document.getElementById("json-file");
const textNodeName = document.getElementById("area-name");
const fileSelector = document.getElementById("select-file");
//enter json by selecting a file
fileSelector.addEventListener("change", async function(event){
  let file = event.target.files.item(0);
  let text = await file.text()
  jsonTextArea.value = text;
})

//process the text in the textarea into the editor
document.getElementById("enter-json").addEventListener("click", function(){
  var data = JSON.parse(jsonTextArea.value); //the parsed data
  textNodeName.value = Object.keys(data)[0];

  var actualData = data[textNodeName.value]; //raw parsed data
  let keyedData = Object.keys(data[textNodeName.value]); //the data but as an array
  for(var i = 0; i < keyedData.length; i++) {

    //create the box for an interactable npc/item
    let newEl = document.createElement("details");
    //summary is the name of the box
    newEl.appendChild(document.createElement("summary"));
    //set the name of the box, which should be the name of the npc
    newEl.querySelector("summary").innerHTML = keyedData[i];
    newEl.classList.add("element");

    //make the box show a custom context menu when right clicked
    newEl.querySelector("summary").addEventListener("contextmenu", function(e){
      messageMenu.style.display = "none";
      document.getElementById("custom-menu").style.display = "block";
      currentElementRightClicked = newEl;
      e.preventDefault();
    })
    //note that an npc can have more than one chunk of a messages that can be triggered
    //parse through each chunk
    for(var s = 0; s < actualData[keyedData[i]].length; s++) {
      //parse through each message for the chunk
      for(var m = 0; m < actualData[keyedData[i]][s].length; m++) {
        //create new message
        let mContainer = document.createElement("div");
        let newM = document.createElement("input");
        mContainer.appendChild(newM);
        newM.type = "text";
        newM.classList.add("message");

        //get the actual content of the message
        let message = actualData[keyedData[i]][s][m];
        console.log(message)

        //display the message in the box
        if(message.m !== undefined) {
          newM.value = message.m;
        }
        else if (message.question !== undefined) {
          newM.value = message.question;
          //different coloring if the message is a question
          newM.classList.add("question");
          //display the answers that can go along with the question
          for(let q = 0; q < message.answers.length; q++) {
            let answer = document.createElement("input");
            answer.type = "text";
            answer.classList.add("answer");
            answer.value = message.answers[q].m;
            mContainer.appendChild(answer);

          }
        }

        //add a custom context menu
        newM.addEventListener("contextmenu", function(e){
          currentMessageRightClicked = newM;
          sectionMenu.style.display = "none";
          messageMenu.style.display = "block";
          e.preventDefault();
          //check and uncheck the boxes automatically when the context menu is open
          if(newM.classList.contains("question")) isQuestionCheckbox.checked  = true
          else isQuestionCheckbox.checked = false;
        })


        newEl.appendChild(mContainer);
      }
    }

    elContainer.appendChild(newEl);
  }
})

//CONTEXT MENU STUFF

//move the context menus to the mouse position
window.addEventListener("contextmenu", function(e){
    sectionMenu.style.left = e.pageX + "px";
    sectionMenu.style.top = e.pageY + "px";
    messageMenu.style.left = e.pageX + "px";
    messageMenu.style.top = e.pageY + "px";

})

//adds events for the context menu
//for editing a speech block
  document.getElementById("m-change").addEventListener("click", function(){
    currentElementRightClicked.querySelector("summary").innerHTML = prompt("New element name: ", "Untitled");
    document.getElementById("custom-menu").style.display = "none";
  })

//for adding a message to a speech block
  document.getElementById("m-add").addEventListener("click", function(){
    let mContainer = document.createElement("div"); //for holding the input
    let newM = document.createElement("input");
    mContainer.appendChild(newM);
    newM.type = "text";
    mContainer.addEventListener("click", function(){
      currentM = mContainer;

    })

    currentElementRightClicked.appendChild(newM);
    document.getElementById("custom-menu").style.display = "none";
  })

//message context menu
messageMenu.addEventListener("click", function(){
  if(isQuestionCheckbox.checked) {
    console.log(currentMessageRightClicked)
    currentMessageRightClicked.classList.add("question");
  } else {
    currentMessageRightClicked.classList.remove("question");
    let answers = currentMessageRightClicked.parentNode.getElementsByClassName("answer");

    for(i = 0; i < answers.length; i++) {
      console.log(answers)
      answers[i].remove();
    }

    innerHTML = ""; //remove the answers, which are the children of this question
  }
  messageMenu.style.display = "none";
})
