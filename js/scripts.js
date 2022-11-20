/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", main);

/* main() FUNCTION */

function main() {

  // get alltodos and initialise listeners
  addTodo();
  // dragover on .todos container
  document.querySelector(".todos").addEventListener("dragover", function (e) {
    e.preventDefault();
    if (
      !e.target.classList.contains("dragging") &&
      e.target.classList.contains("card")
    ) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...this.querySelectorAll(".card")];
      const currPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      console.log(currPos, newPos);
      if (currPos > newPos) {
        this.insertBefore(draggingCard, e.target);
      } else {
        this.insertBefore(draggingCard, e.target.nextSibling);
      }
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currPos, 1);
      todos.splice(newPos, 0, removed[0]);
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });


  // add new todos on user input
  const add = document.getElementById("add-btn");
  const txtInput = document.querySelector(".txt-input");
  add.addEventListener("click", function () {
    const item = txtInput.value.trim();
    if (item) {
      txtInput.value = "";
      const todos = !localStorage.getItem("todos")
        ? []
        : JSON.parse(localStorage.getItem("todos"));
      const currentTodo = {
        item,
        isCompleted: false,
      };
      addTodo([currentTodo]);
      todos.push(currentTodo);
      localStorage.setItem("todos", JSON.stringify(todos));
    }
    txtInput.focus();
  });
  // add todo also on enter key event
  txtInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      add.click();
    }
  });


  // filter todo - all, active, completed
  document.querySelector(".filter").addEventListener("click", function (e) {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });
  // clear completed
  document
    .getElementById("clear-completed")
    .addEventListener("click", function () {
      deleteIndexes = [];
      document.querySelectorAll(".card.checked").forEach(function (card) {
        deleteIndexes.push(
          [...document.querySelectorAll(".todos .card")].indexOf(card)
        );
        card.classList.add("fall");
        card.addEventListener("animationend", function (e) {
          setTimeout(function () {
            card.remove();
          }, 100);
        });
      });
      removeManyTodo(deleteIndexes);
    });
}

/* stateTodo() FUNCTION TO UPDATE TODO ABOUT COMPLETION */

function stateTodo(index, completed) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = completed;
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* removeManyTodo() FUNCTION TO REMOVE ONE TODO */

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* removeManyTodo FUNCTION TO REMOVE MANY TODOS */

function removeManyTodo(indexes) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter(function (todo, index) {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* addTodo() FUNCTION TO LIST/CREATE TODOS AND ADD EVENT LISTENERS */

function addTodo(todos = JSON.parse(localStorage.getItem("todos"))) {
  if (!todos) {
    return null;
  }
  const itemsLeft = document.getElementById("items-left");
  // create cards
  todos.forEach(function (todo) {
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const check = document.createElement("span");
    const item = document.createElement("p");
    const button = document.createElement("button");
    const editbutton = document.createElement("button");
    const savebutton = document.createElement("button");
    const img = document.createElement("img");
    const editimg = document.createElement("img");
    const saveimg = document.createElement("img");
    const editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("id", "editInput");
    editInput.setAttribute("style", "display:none");


    editInput.classList.add("txt-input");
    editInput.classList.add("item");
    // Add classes
    card.classList.add("card");
    button.classList.add("clear");
    editbutton.classList.add("edit");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    item.classList.add("item");
    check.classList.add("check");
    button.classList.add("clear");
    editbutton.classList.add("edit");
    savebutton.classList.add("savebut");
    savebutton.setAttribute("style", "display:none");


    // Set attributes
    card.setAttribute("draggable", true);
    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");

    editimg.setAttribute("src", "./assets/images/icon-edit.svg");
    editimg.setAttribute("alt", "Edit");

     saveimg.setAttribute("src", "./assets/images/icon-save.svg");
    saveimg.setAttribute("alt", "Save");

    cbInput.setAttribute("type", "checkbox");
    // set todo item for card
    item.textContent = todo.item;
    // if completed -> add respective class / attribute
    if (todo.isCompleted) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }
    // Add drag listener to card
    card.addEventListener("dragstart", function () {
      this.classList.add("dragging");
    });
    card.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });
    // Add click listener to checkbox
    cbInput.addEventListener("click", function () {
      const correspondingCard = this.parentElement.parentElement;
      const checked = this.checked;
      stateTodo(
        [...document.querySelectorAll(".todos .card")].indexOf(
          correspondingCard
        ),
        checked
      );
      checked
        ? correspondingCard.classList.add("checked")
        : correspondingCard.classList.remove("checked");
      itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });


    // Add click listener to clear button
    button.addEventListener("click", function () {
      const correspondingCard = this.parentElement;
      correspondingCard.classList.add("fall");
      removeTodo(
        [...document.querySelectorAll(".todos .card")].indexOf(
          correspondingCard
        )
      );
      correspondingCard.addEventListener("animationend", function () {
        setTimeout(function () {
          correspondingCard.remove();
          itemsLeft.textContent = document.querySelectorAll(
            ".todos .card:not(.checked)"
          ).length;
        }, 100);
      });
    });

    // Add click listener to clear button
    editbutton.addEventListener("click", function () {
      const correspondingCard = this.parentElement;

      correspondingCard.children[0].setAttribute("style", "display:none");
      correspondingCard.children[1].setAttribute("style", "display:none"); 
      correspondingCard.children[2].setAttribute("style", "display:block;color: darkkhaki;");
      correspondingCard.children[2].classList.add("blink");
      correspondingCard.children[2].setAttribute("value", correspondingCard.children[1].innerHTML);
      correspondingCard.children[2].focus();
      correspondingCard.children[3].setAttribute("style", "display:block;");
      correspondingCard.children[4].setAttribute("style", "display:none"); 
      correspondingCard.children[5].setAttribute("style", "display:none"); 

    });

    savebutton.addEventListener("click", function () {
      const correspondingCard = this.parentElement;

      //save to db with ajax

      correspondingCard.children[0].setAttribute("style", "display:block"); 
       correspondingCard.children[1].setAttribute("style", "display:block"); 
      correspondingCard.children[1].innerHTML = correspondingCard.children[2].value;
      correspondingCard.children[2].setAttribute("style", "display:none;color: darkkhaki;");
      correspondingCard.children[2].setAttribute("value", "");
      correspondingCard.children[3].setAttribute("style", "display:none;");
      correspondingCard.children[4].setAttribute("style", "display:block"); 
      correspondingCard.children[5].setAttribute("style", "display:block"); 

    });



    // parent.appendChild(child)
    button.appendChild(img);
    editbutton.appendChild(editimg);
    savebutton.appendChild(saveimg);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(check);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(editInput);
    card.appendChild(savebutton);
    card.appendChild(editbutton);
    card.appendChild(button);
    
    document.querySelector(".todos").appendChild(card);
  });
  // Update itemsLeft
  itemsLeft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked)"
  ).length;
}
