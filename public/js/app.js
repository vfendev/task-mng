
fetch('http://localhost:3000/users/me').then(result => {
    console.log(result.json());
})

// async function fetchData() {
//     const response = await fetch('http://localhost:3000/users/login')
//     console.log(response);
    
// }

// fetchData();


// const html = Mustache.render(messageTemplate, {
//     username: message.username,
//     message: message.text,
//     createdAt: moment(message.createdAt).format('H:mm:ss')
// })
// $messages.insertAdjacentHTML('beforeend', html)