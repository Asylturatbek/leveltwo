const sock = io();

sock.on('message', (text) => {
	writeEvent(text)
})

const onFormSubmitted = (e) => {
	e.preventDefault();

	const input = document.querySelector('#chat')
	const text = input.value;
	input.value = '';

	sock.emit('message', text)
}

const writeEvent = (text) => {
	// ul element
	const parent = document.querySelector('#events');

	// li element
	const el = document.createElement('li');
	el.innerHTML = text;

	parent.appendChild(el);
}

writeEvent('Welcome to RPS from client.js file')

document
	.querySelector('#chat-form')
	.addEventListener('submit', onFormSubmitted)