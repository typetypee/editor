const addButton = document.getElementById("add-element");
const summaryContainer = document.getElementById("summary-container");
const summaryMenu = document.getElementById("summary-menu");
const messageMenu = document.getElementById("message-menu");
const addAnswerButton = document.getElementById("add-answer");
const deleteMessageButton = document.getElementById("delete-message");
const answerMenu = document.getElementById("answer-menu");
const deleteAnswerButton = document.getElementById("delete-answer")
let currentElementRightClicked = "";

//checkboxes
const isQuestionCheckbox = document.getElementById("isQuestion");
const hasNameCheckbox = document.getElementById("hasName");
const hasNextCheckbox = document.getElementById("hasNext");
const hasLabelCheckbox = document.getElementById("hasLabel");

const hasCompleteCheckbox = document.getElementById("hasComplete");
const isCompleteCheckbox = document.getElementById("isComplete");

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

  summaryContainer.innerHTML = "";

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

        //get the actual content of the message
        let message = actualData[keyedData[i]][s][m]; //will contain name, message, next, answers, etc.
        
        let messageContainer = document.createElement("div"); //container for either the message or questions + answers
        messageContainer.classList.add("messageContainer");
        //DISPLAY THE NAME

        let nameContainer = document.createElement("div");
        nameContainer.classList.add("nameContainer");

        let nameLabel = document.createElement("a");
        nameLabel.innerText = "Name: "
        nameContainer.appendChild(nameLabel);

        let name = document.createElement("input");
        name.classList.add("name");

        name.type = "text";
        nameContainer.appendChild(name);

        messageContainer.appendChild(nameContainer);

        if(message.n !== undefined) {
          name.value = message.n;
          nameContainer.style.display = "block";
        } else {
          name.value = "";
          nameContainer.style.display = "none";
        }

        //create new message
        let messageInput = document.createElement("input");
        messageContainer.appendChild(messageInput);
        messageInput.type = "text";
        messageInput.classList.add("message");


        //IF IS A MESSAGE
        //display the message in the box
        if(message.m !== undefined) messageInput.value = message.m;
        //IF IS A QUESTION
        else if (message.question !== undefined) {
          messageInput.value = message.question;
          //different coloring if the message is a question
          messageInput.classList.add("question");

          //display the answers that can go along with the question
          for(let q = 0; q < message.answers.length; q++) {
            let answerContainer = document.createElement("div");
            let answer = document.createElement("input");
            answer.type = "text";
            answer.classList.add("answer");
            answer.value = message.answers[q].m;
            answerContainer.appendChild(answer);
            answerContainer.classList.add("answerContainer");
            messageContainer.appendChild(answerContainer);
            //add a right click context menu to the answers
            answer.addEventListener("contextmenu", function(e){
              summaryMenu.style.display = "none";
              messageMenu.style.display = "none";
              answerMenu.style.display = "block";
              currentElementRightClicked = answer;
              e.preventDefault();
            })
            //add "next" label to the answers
            if(message.answers[q].next !== undefined) {
              let nextContainer = document.createElement("div");
              let nextLabel = document.createElement("a");
              nextLabel.innerText = "Next: "
              nextContainer.appendChild(nextLabel);
              let next = document.createElement("input");
              next.type = "text";
              next.value = message.answers[q].next;
              next.classList.add("next");
              currentElementRightClicked = nextContainer;
              nextContainer.appendChild(next);
        
              nextContainer.classList.add("nextContainer");
              answerContainer.appendChild(nextContainer);

            }

          }

        }

        newDropDown.appendChild(messageContainer);
          
        //add the label label, if it is checked
        let labelContainer = document.createElement("div");
        let labelLabel = document.createElement("a");
        labelLabel.innerText = "Label: "
        labelContainer.appendChild(labelLabel);
        let label = document.createElement("input");
        label.type = "text";
        label.classList.add("next");
        currentElementRightClicked = labelContainer;
        labelContainer.appendChild(label);
      
        labelContainer.classList.add("labelContainer");
        messageContainer.appendChild(labelContainer);

        if(message.label !== undefined) {
          label.value = message.label;
          labelContainer.style.display = "block";
        }
        else {
          label.value = "";
          labelContainer.style.display = "none";
        }
        
        //add the next label
        let nextContainer = document.createElement("div");
        let nextLabel = document.createElement("a");
        nextLabel.innerText = "Next: "
        nextContainer.appendChild(nextLabel);
        let next = document.createElement("input");
        next.type = "text";
        next.classList.add("next");
        currentElementRightClicked = nextContainer;
        nextContainer.appendChild(next);
      
        nextContainer.classList.add("nextContainer");
        messageContainer.appendChild(nextContainer);

        if(message.next !== undefined) {
          next.value = message.next;
          nextContainer.style.display = "block";
        }
        else {
          next.value = "";
          nextContainer.style.display = "none";
        }

        //make isComplete container appear or not!
        let completeContainer = document.createElement("div");
        let isCompleteCheckbox = document.createElement("input");
        isCompleteCheckbox.type = "checkbox";
        completeContainer.appendChild(isCompleteCheckbox);

        let isCompleteLabel = document.createElement("label");
        isCompleteLabel.innerText = "Is complete?"
        completeContainer.appendChild(isCompleteLabel);
        
        completeContainer.classList.add("completeContainer");

        messageContainer.appendChild(completeContainer);

        if(message.complete !== undefined) {
          completeContainer.style.display = "block";
          isCompleteCheckbox.checked = true;
        }
        else {
          completeContainer.style.display = "none";
          isCompleteCheckbox.checked = false;
        }
        

        //add a custom context menu for the message/question
        messageInput.addEventListener("contextmenu", function(e){
          currentElementRightClicked = messageInput;
          summaryMenu.style.display = "none";
          answerMenu.style.display = "none";
          messageMenu.style.display = "block";
          currentElementRightClicked = messageInput;
          e.preventDefault();
          //check and uncheck the boxes automatically when the context menu is open
          if(messageInput.classList.contains("question")) {
            isQuestionCheckbox.checked  = true
            //hide or show buttons depending on whether or not the message is marked as a question
            addAnswerButton.style.display = "block"
          }
          else {
            isQuestionCheckbox.checked = false;
            addAnswerButton.style.display = "none"
          }

          if(window.getComputedStyle(labelContainer, null).getPropertyValue("display") !== "none") hasLabelCheckbox.checked = true;
          else hasLabelCheckbox.checked = false;
          if(window.getComputedStyle(nameContainer, null).getPropertyValue("display") !== "none") hasNameCheckbox.checked = true;
          else hasNameCheckbox.checked = false;
          if(window.getComputedStyle(nextContainer, null).getPropertyValue("display") !== "none") hasNextCheckbox.checked = true;
          else hasNextCheckbox.checked = false;
          if(window.getComputedStyle(completeContainer, null).getPropertyValue("display") !== "none") hasCompleteCheckbox.checked = true;
          else hasCompleteCheckbox.checked = false;
        })

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
    currentElementRightClicked.classList.add("question");
  } else {
    //if unchecked...
    currentElementRightClicked.classList.remove("question");

    //very important note: the container of the currentElementRightClicked (which in this case, should be the question input), is the parent of the answers, the question is NOT the parent of the answers
    //remove the answers elements if the question is unchecked
    let answers = currentElementRightClicked.parentNode.getElementsByClassName("answer");
    for(i = 0; i < answers.length; i++) {
      answers[i].remove();
      i--
    }

  }
  messageMenu.style.display = "none";

  //update status
  if(hasNameCheckbox.checked) currentElementRightClicked.parentNode.getElementsByClassName("nameContainer")[0].style.display = "block";
  else currentElementRightClicked.parentNode.getElementsByClassName("nameContainer")[0].style.display = "none";

  if(hasNextCheckbox.checked) currentElementRightClicked.parentNode.getElementsByClassName("nextContainer")[0].style.display = "block";
  else currentElementRightClicked.parentNode.getElementsByClassName("nextContainer")[0].style.display = "none";

  if(hasLabelCheckbox.checked) currentElementRightClicked.parentNode.getElementsByClassName("labelContainer")[0].style.display = "block";
  else currentElementRightClicked.parentNode.getElementsByClassName("labelContainer")[0].style.display = "none";

  if(hasCompleteCheckbox.checked) currentElementRightClicked.parentNode.getElementsByClassName("completeContainer")[0].style.display = "block";
  else currentElementRightClicked.parentNode.getElementsByClassName("completeContainer")[0].style.display = "none";

  /** 
  if(hasCompleteCheckbox.checked) currentElementRightClicked.parentNode.getElementsByClassName("completeContainer")[0].style.display = "inline-block";
  else currentElementRightClicked.parentNode.getElementsByClassName("completeContainer")[0].style.display = "none";*/

})

//will only appear in the context menu if the answer is a question
addAnswerButton.addEventListener("click", function(){

  console.log(currentElementRightClicked)
  let answer = document.createElement("input");
  answer.type = "text";
  answer.classList.add("answer");
  answer.value = "";
  //add a right click context menu to the answers
  answer.addEventListener("contextmenu", function(e){
    summaryMenu.style.display = "none";
    messageMenu.style.display = "none";
    answerMenu.style.display = "block";
    e.preventDefault();
  })

  currentElementRightClicked.parentNode.appendChild(answer);
})

deleteMessageButton.addEventListener("click", function(){
  currentElementRightClicked.remove();
})

deleteAnswerButton.addEventListener("click", function(){
  currentElementRightClicked.remove();
})

//hide context menus when clicking outside of them
function hideContextMenus(e) {
  if(!e.target.parentNode.classList.contains("dropDown") && !e.target.classList.contains("message") && !e.target.classList.contains("question") && !e.target.classList.contains("answer")) {
    summaryMenu.style.display = "none";
    messageMenu.style.display = "none";
    answerMenu.style.display = "none";
  }
}

window.addEventListener("click", hideContextMenus, false);
window.addEventListener("contextmenu", hideContextMenus, false);