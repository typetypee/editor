const addButton = document.getElementById("add-element");
const summaryContainer = document.getElementById("summary-container");
const summaryMenu = document.getElementById("summary-menu");
const messageMenu = document.getElementById("message-menu");
const addAnswerButton = document.getElementById("add-answer");
const deleteMessageButton = document.getElementById("delete-message");
const answerMenu = document.getElementById("answer-menu");
let currentElementRightClicked = "";
let currentMessageRightClicked = "";

//checkboxes
const isQuestionCheckbox = document.getElementById("isQuestion");

//this button creates a new speech block/summary
addButton.addEventListener("click", function(){
  let newDropDown = document.createElement("details");
  newDropDown.appendChild(document.createElement("summary"));
  newDropDown.querySelector("summary").innerHTML = "Untitled"
  newDropDown.classList.add("dropDown")

  newDropDown.addEventListener("contextmenu", function(e){
    summaryMenu.style.display = "block";
    currentElementRightClicked = newDropDown;
    e.preventDefault();
  })

  summaryContainer.appendChild(newDropDown);
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
  textNodeName.value = Object.keys(data)[0]; ///get the name of the text data chunk

  var actualData = data[textNodeName.value]; //raw parsed data
  let keyedData = Object.keys(data[textNodeName.value]); //the data but as an array
  for(var i = 0; i < keyedData.length; i++) {

    //create the box for an interactable npc/item (this will appear as a dropdown box)
    let newDropDown = document.createElement("details");
    //summary is the name of the box
    newDropDown.appendChild(document.createElement("summary"));
    //set the name of the box, which should be the name of the npc
    newDropDown.querySelector("summary").innerHTML = keyedData[i];
    newDropDown.classList.add("dropDown");

    //make the box show a custom context menu when right clicked
    newDropDown.querySelector("summary").addEventListener("contextmenu", function(e){
      messageMenu.style.display = "none"; //make sure to hide the "message" context menu
      document.getElementById("summary-menu").style.display = "block";
      currentElementRightClicked = newDropDown;
      e.preventDefault();
    })
    //note that an npc can have more than one chunk of a messages that can be triggered
    //parse through each chunk
    for(var s = 0; s < actualData[keyedData[i]].length; s++) {
      //parse through each message for the chunk
      for(var m = 0; m < actualData[keyedData[i]][s].length; m++) {
        //create new message
        let messageContainer = document.createElement("div"); //container for either the message or questions + answers
        let messageInput = document.createElement("input");
        messageContainer.appendChild(messageInput);
        messageInput.type = "text";
        messageInput.classList.add("message");

        //get the actual content of the message
        let message = actualData[keyedData[i]][s][m];
        console.log(message)

        //display the message in the box
        if(message.m !== undefined) {
          messageInput.value = message.m;
        }
        else if (message.question !== undefined) {
          messageInput.value = message.question;
          //different coloring if the message is a question
          messageInput.classList.add("question");

          //display the answers that can go along with the question
          for(let q = 0; q < message.answers.length; q++) {
            let answer = document.createElement("input");
            answer.type = "text";
            answer.classList.add("answer");
            answer.value = message.answers[q].m;
            messageContainer.appendChild(answer);
            //add a right click context menu to the answers
            answer.addEventListener("contextmenu", function(e){
              summaryMenu.style.display = "none";
              messageMenu.style.display = "none";
              answerMenu.style.display = "block";
              e.preventDefault();
            })
          }

        }
        //add a custom context menu for the message/question
        messageInput.addEventListener("contextmenu", function(e){
          currentMessageRightClicked = messageInput;
          summaryMenu.style.display = "none";
          answerMenu.style.display = "none";
          messageMenu.style.display = "block";
          currentMessageRightClicked = messageInput;
          e.preventDefault();
          //check and uncheck the boxes automatically when the context menu is open
          if(messageInput.classList.contains("question")) isQuestionCheckbox.checked  = true
          else isQuestionCheckbox.checked = false;
        })
        newDropDown.appendChild(messageContainer);
      }
    }

    summaryContainer.appendChild(newDropDown);
  }
})

//CONTEXT MENU STUFF

//move the context menus to the mouse position
window.addEventListener("contextmenu", function(e){
    summaryMenu.style.left = e.pageX + "px";
    summaryMenu.style.top = e.pageY + "px";
    messageMenu.style.left = e.pageX + "px";
    messageMenu.style.top = e.pageY + "px";
    answerMenu.style.left = e.pageX + "px";
    answerMenu.style.top = e.pageY + "px";

})

//adds events for the context menu
//for editing a speech block (the dropdown box)
  //change the name of the speech block
  document.getElementById("m-change").addEventListener("click", function(){
    currentElementRightClicked.querySelector("summary").innerHTML = prompt("New element name: ", "Untitled");
    summaryMenu.style.display = "none";
  })

//for adding a message to a speech block
  document.getElementById("m-add").addEventListener("click", function(){
    let messageContainer = document.createElement("div"); //for holding the input
    let newMessage = document.createElement("input");
    messageContainer.appendChild(newMessage);
    newMessage.type = "text";
    /**messageContainer.addEventListener("click", function(){
      currentM = messageContainer;

    })**/

    currentElementRightClicked.appendChild(newMessage);
    summaryMenu.style.display = "none";
  })

//message/question context menu
messageMenu.addEventListener("click", function(){
  //check and uncheck the question checkbox and update status
  if(isQuestionCheckbox.checked) {
    console.log(currentMessageRightClicked)
    currentMessageRightClicked.classList.add("question");
  } else {
    //if unchecked...
    currentMessageRightClicked.classList.remove("question");

    //very important note: the container of the currentMessageRightClicked (which in this case, should be the question input), is the parent of the answers, the question is NOT the parent of the answers
    //remove the answers elements if the question is unchecked
    let answers = currentMessageRightClicked.parentNode.getElementsByClassName("answer");
    for(i = 0; i < answers.length; i++) {
      console.log(answers[i])
      answers[i].remove();
      i--
    }

  }
  messageMenu.style.display = "none";
})

addAnswerButton.addEventListener("click", function(){}

//hide context menus when clicking outside of them
function hideContextMenus(e) {
  if(!e.target.parentNode.classList.contains("dropDown") && !e.target.classList.contains("message") && !e.target.classList.contains("question") && !e.target.classList.contains("answer")) {
    summaryMenu.style.display = "none";
    messageMenu.style.display = "none";
    answerMenu.style.display = "none";
    console.log("Hiding context menus");
  }
}

window.addEventListener("click", hideContextMenus, false);
window.addEventListener("contextmenu", hideContextMenus, false);