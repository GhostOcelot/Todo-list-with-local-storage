const form = document.querySelector('form')
const list = document.querySelector('.list')
const submit = document.querySelector('.submit')
const input = document.querySelector('.input')
const badge = document.querySelectorAll('.badge')
const filter = document.querySelector('.filter')

const updateContent = () => {
	if (localStorage.getItem('list') !== null) {
		const updatedList = localStorage.getItem('list');
		console.log(JSON.parse(updatedList))
		list.innerHTML = JSON.parse(updatedList)
	}	
}

updateContent()

//////////////////////////////////////////////////////////////////

const addListItem = (e) => {
	e.preventDefault();
	const newListItem = document.createElement('li');
	newListItem.className = 'list-group-item d-flex justify-content-between align-items-center';
	newListItem.innerHTML = `
	${input.value}
	<span class="badge badge-info">Delete</span>
	`
	if (/\w/.test(input.value)) {
		list.append(newListItem);
	}
	form.reset();
	localStorage.setItem('list', JSON.stringify(list.innerHTML));
}

submit.addEventListener('click', addListItem);

//////////////////////////////////////////////////////////////////

const removeListItem = function (e) {
	if (e.target.classList.contains('badge')) {
		e.target.parentElement.remove();
		localStorage.setItem('list', JSON.stringify(list.innerHTML));
	}
}

list.addEventListener('click', removeListItem)

//////////////////////////////////////////////////////////////////

const filterItems = (e) => {
	const text = e.target.value.toLowerCase();
	const listItems = Array.from(list.querySelectorAll('li'));
	listItems.forEach(item => {
		const singleListItem = item.firstChild.textContent.trim()
		if (singleListItem.includes(text) === false) {
			item.classList.add('invisible') 
		}
		else if (singleListItem.includes(text)) {
			item.classList.remove('invisible') 
		}
	})
}

filter.addEventListener('keyup', filterItems)
