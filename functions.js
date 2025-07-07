const addButton = document.getElementById("add-element");
const summaryContainer = document.getElementById("summary-container");
const summaryMenu = document.getElementById("summary-menu");

const messageChunkMenu = document.getElementById("message-chunk-menu");

const messageMenu = document.getElementById("message-menu");
const addAnswerButton = document.getElementById("add-answer");

const answerMenu = document.getElementById("answer-menu");
const deleteAnswerButton = document.getElementById("delete-answer")

let currentElementRightClicked = "";

//checkboxes
const isQuestionCheckbox = document.getElementById("isQuestion");
const hasNameCheckbox = document.getElementById("hasName");
const hasNextCheckbox = document.getElementById("hasNext");
const hasLabelCheckbox = document.getElementById("hasLabel");
const answerHasEventCheckbox = document.getElementById("answerHasEvent");
const hasEventCheckbox = document.getElementById("hasEvent");

const hasCompleteCheckbox = document.getElementById("hasComplete");
const isCompleteCheckbox = document.getElementById("isComplete");

function createMessageChunk() {
  let messageChunkContainer = document.createElement("div");
  messageChunkContainer.classList.add("messageChunkContainer");

  //make the box show a custom context menu when right clicked
  messageChunkContainer.addEventListener("contextmenu", function(e){
    //hide the other menus!
    hideOtherContextMenus(messageChunkMenu);
    currentElementRightClicked = messageChunkContainer;
    messageChunkMenu.style.left = e.pageX + "px";
    messageChunkMenu.style.top = e.pageY + "px";
    e.preventDefault();
  })

  return messageChunkContainer;
}

//creates answers to add to an answerContainer
function createAnswer(message) {
    let answerContainer = document.createElement("div");
    answerContainer.classList.add("answerContainer");
    
    let answer = document.createElement("input");
    answer.type = "text";
    answer.classList.add("answer");
    answerContainer.appendChild(answer);

    //add "next" label to the answers
    let nextContainer = document.createElement("div");
    let nextLabel = document.createElement("a");
    nextLabel.innerText = "Next: "
    nextContainer.appendChild(nextLabel);
    let next = document.createElement("input");
    next.type = "text";
    next.classList.add("next");
    nextContainer.appendChild(next);

    nextContainer.classList.add("nextContainer");
    answerContainer.appendChild(nextContainer);

    //add a "event" label to the answers
    let eventContainer = document.createElement("div");
    let eventLabel = document.createElement("a");
    eventLabel.innerText = "Event: "
    eventContainer.appendChild(eventLabel);
    let eventThing = document.createElement("input");
    eventThing.type = "text";
    eventThing.classList.add("event");
    eventContainer.appendChild(eventThing);
    eventContainer.classList.add("eventContainer");
    answerContainer.appendChild(eventContainer);

    //event label hidden by default
    eventContainer.style.display = "none";

    //add a right click context menu to the answers
    answerContainer.addEventListener("contextmenu", function(e){
        hideOtherContextMenus(answerMenu);
        currentElementRightClicked = answerContainer;
        answerMenu.style.left = e.pageX + "px";
        answerMenu.style.top = e.pageY + "px";
        if(window.getComputedStyle(eventContainer, null).getPropertyValue("display") !== "none") answerHasEventCheckbox.checked = true;
        else answerHasEventCheckbox.checked = false;
        e.preventDefault();
        e.stopPropagation();
    })

    //if we are not adding answers and instead create answers from a file, add in the values of the "answers", "next", and "event"

    if(message !== undefined) {
        answer.value = message.m;
        next.value = message.next;
        if(message.event !== undefined) {
            eventThing.value = message.event;
            eventContainer.style.display = "block";
        }
        else {
            eventThing.value = "";
            eventContainer.style.display = "none";
        }
    }

    return answerContainer;
}

function createMessage(){
    //create the message container
    let messageContainer = document.createElement("div"); //container for either the message or questions + answers
    messageContainer.classList.add("messageContainer");
    messageChunkContainer.appendChild(messageContainer);
    
    //add drag functionality

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
    //hide the nameContainer at first
    nameContainer.style.display = "none";

    messageContainer.appendChild(nameContainer);


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

    //hide the labelContainer at first
    labelContainer.style.display = "none";
    
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

    //hide the next container at first
    nextContainer.style.display = "none";

    //add the event label
    let eventContainer = document.createElement("div");
    let eventLabel = document.createElement("a");
    eventLabel.innerText = "Event: "
    eventContainer.appendChild(eventLabel);
    let eventThing = document.createElement("input");
    eventThing.type = "text";
    eventThing.classList.add("event");
    currentElementRightClicked = eventContainer;
    eventContainer.appendChild(eventThing);
    
    eventContainer.classList.add("eventContainer");
    messageContainer.appendChild(eventContainer);

    //hide the event label at first
    eventContainer.style.display = "none";

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

    //hide at first
    completeContainer.style.display = "none";

    //add a custom context menu for the message/question
    messageContainer.addEventListener("contextmenu", function(e){
        hideOtherContextMenus(messageMenu);
        currentElementRightClicked = messageContainer;
        messageMenu.style.left = e.pageX + "px";
        messageMenu.style.top = e.pageY + "px";
        e.preventDefault();
        e.stopPropagation();
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
        if(window.getComputedStyle(eventContainer, null).getPropertyValue("display") !== "none") hasEventCheckbox.checked = true;
        else hasEventCheckbox.checked = false;
        if(window.getComputedStyle(completeContainer, null).getPropertyValue("display") !== "none") hasCompleteCheckbox.checked = true;
        else hasCompleteCheckbox.checked = false;
    })

    return messageContainer;

}