const form = document.querySelector("form");
const list = document.querySelector(".list");
const submit = document.querySelector(".submit");
const input = document.querySelector(".input");
const deleteBtn = document.querySelectorAll(".delete");
const filter = document.querySelector(".filter");

//rendering todos
const addListItem = doc => {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center my-1";
  li.setAttribute("data-id", doc.id)
  li.innerHTML = `
	${doc.data().name.toLowerCase()}
	<span class="d-flex align-items-right ">
		<span class="badge badge-warning highlight mx-2">Highlight</span>
		<span class="badge badge-danger delete">Delete</span>
	</span>
    `;

  list.append(li);

  form.reset();
  if (list.children.length === 0) {
    document.querySelector(".listHeader").classList.remove("d-none");
  }
};

submit.addEventListener("click", addListItem);


//getting todos from Firestore
// db.collection("Todos").get().then(snapshot => {
//   snapshot.docs.forEach(doc => addListItem(doc))
// })

// add new todos
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("Todos").add({
    name: form.name.value,
    important: false
  })
  form.name.value = null
})

//live update
db.collection("Todos").onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    console.log(change)
    if (change.type === "added") {
      console.log(doc.data().important)
      addListItem(change.doc)
    } else if (change.type === "removed") {
      let li = list.querySelector(`[data-id="${change.doc.id}"]`);
      list.removeChild(li)
    } else if (change.type === "modified") {
      db.collection("Todos").doc(`${change.doc.id}`).get()
        .then(doc => {
          if (doc.exists) {
            if (doc.data().important) { list.querySelector(`[data-id="${change.doc.id}"]`).classList.add("important") }
            else if (!doc.data().important) { list.querySelector(`[data-id="${change.doc.id}"]`).classList.remove("important") }
          } else { console.log("no such document!") }
        })
        .catch(error => console.log(error))
    }
  })
})



//remove items from list
const removeListItem = function (e) {
  if (e.target.classList.contains("delete")) {
    const id = e.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("Todos").doc(id).delete()
    if (list.children.length === 0) {
      document.querySelector(".listHeader").classList.add("d-none");
    }
  }
};

list.addEventListener("click", removeListItem);


//marking important items
const highlightListItem = function (e) {
  if (e.target.classList.contains("highlight")) {
    const id = e.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("Todos").doc(id).get().then(doc => {
      const isImportant = doc.data().important;
      if (isImportant === false) {
        db.collection("Todos").doc(id).update({ important: true });
      }
      else if (isImportant === true) {
        db.collection("Todos").doc(id).update({ important: false })
      }
    });
  }
};

list.addEventListener("click", highlightListItem);


//filtering todos
const filterItems = e => {
  const text = e.target.value;
  const listItems = Array.from(list.querySelectorAll("li"));
  listItems.forEach(item => {
    const singleListItem = item.firstChild.textContent.trim();
    if (!singleListItem.includes(text)) {
      item.classList.add("invisible");
    } else if (singleListItem.includes(text)) {
      item.classList.remove("invisible");
    }
  });
};

filter.addEventListener("keyup", filterItems)
