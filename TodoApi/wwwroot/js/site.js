const uri = 'api/TodoItems';
let todos = [];

function getItem() {
  fetch(uri)
    .then(res => res.json())
    .then(data => _displayItems(data))
    .catch(error => console.log("Unable to get items", error));
}

function addItem() {
  const addNameTextbox = document.querySelector("#add-name");

  const item = {
    isComplete: false,
    name: addNameTextbox.value.trim()
  };

  fetch(uri, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(res => res.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
    })
    .catch(error => console.log("Unable to add item.", error));
}

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
    .then(() => getItems())
    .catch(error => console.log("Unable to delete item", error));
}

function updateItem() {
  const itemId = document.querySelector("#edit-id").value;
  const item = {
    id: parseInt(itemId, 10),
    isComplete: document.querySelector("#edit-isComplete").checked,
    name: document.querySelector("#edit-name").value.trim()
  };

  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(() => getItems())
    .catch(error => console.log("Unable to update item", error));

  closeInput();

  return false;
}

function closeInput() {
  document.querySelector("#editForm").style.display = "none";
}

function _displayCount(itemCount) {
  const name = itemCount === 1 ? "to-do" : "to-dos";

  document.querySelector("#counter").innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.querySelector("#todos");
  tBody.innerHTML = "";

  _displayCount(data.length);

  const btn = document.createElement("button");

  data.forEach(item => {
    let isCompleteCheckbox = document.createElement("input");
    isCompleteCheckbox.type = "checkbox";
    isCompleteCheckbox.disabled = true;
    isCompleteCheckbox.checked = item.isComplete;

    let editBtn = btn.cloneNode(false);
    editBtn.innerText = "Edit";
    editBtn.setAttribute("onclick", `displayEditForms(${item.id})`);

    let deleteBtn = btn.cloneNode(false);
    deleteBtn.innerText = "Delete";
    deleteBtn.setAttribute("onclick", `deleteItem(${item.id})`);

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    td1.appendChild(isCompleteCheckbox);

    let td2 = tr.insertCell(1);
    let textNode = document.createTextNode(item.name);
    td2.appendChild(textNode);

    let td3 = tr.insertCell(2);
    td3.appendChild(editBtn);

    let td4 = tr.insertCell(3);
    td4.appendChild(deleteBtn);
  });

  todos = data;
}