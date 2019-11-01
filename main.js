const form = document.querySelector("form");
const list = document.querySelector(".list");
const submit = document.querySelector(".submit");
const input = document.querySelector(".input");
const deleteBtn = document.querySelectorAll(".delete");
const filter = document.querySelector(".filter");

const updateContent = () => {
  if (localStorage.getItem("list") !== null) {
    const updatedList = localStorage.getItem("list");
    list.innerHTML = JSON.parse(updatedList);
  }
};

updateContent();

//////////////////////////////////////////////////////////////////

const addListItem = e => {
  e.preventDefault();
  const newListItem = document.createElement("li");
  newListItem.className =
    "list-group-item d-flex justify-content-between align-items-center my-1";
  newListItem.innerHTML = `
	${input.value}
	<span class="d-flex align-items-right ">
		<span class="badge badge-warning highlight mx-2">Highlight</span>
		<span class="badge badge-danger delete">Delete</span>
	</span>
		`;
  if (/\w/.test(input.value)) {
    list.append(newListItem);
  }
  form.reset();
  document.querySelector(".listHeader").classList.remove("d-none");
  localStorage.setItem("list", JSON.stringify(list.innerHTML));
};

submit.addEventListener("click", addListItem);

//////////////////////////////////////////////////////////////////

const removeListItem = function(e) {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.parentElement.remove();
    if (list.children.length === 0) {
      document.querySelector(".listHeader").classList.add("d-none");
    }
    localStorage.setItem("list", JSON.stringify(list.innerHTML));
  }
};

list.addEventListener("click", removeListItem);

//////////////////////////////////////////////////////////////////

const highlightListItem = function(e) {
  if (e.target.classList.contains("highlight")) {
    e.target.parentElement.parentElement.classList.toggle("important");
    localStorage.setItem("list", JSON.stringify(list.innerHTML));
  }
};

list.addEventListener("click", highlightListItem);

//////////////////////////////////////////////////////////////////

const filterItems = e => {
  const text = e.target.value.toLowerCase();
  const listItems = Array.from(list.querySelectorAll("li"));
  listItems.forEach(item => {
    const singleListItem = item.firstChild.textContent.trim();
    if (singleListItem.includes(text) === false) {
      item.classList.add("invisible");
    } else if (singleListItem.includes(text)) {
      item.classList.remove("invisible");
    }
  });
};

filter.addEventListener("keyup", filterItems);
