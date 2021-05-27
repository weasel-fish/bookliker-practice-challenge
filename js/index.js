document.addEventListener("DOMContentLoaded", init())

const userObj = {"id":1, "username":"pouros"} //quotes or no quotes?

let likeArray = []
let liked

const bookPanel = document.querySelector('#show-panel')

function init() {
  getListOfBooks()
}

//GET list of books
function getListOfBooks() {
  fetch('http://localhost:3000/books')
  .then(resp => resp.json())
  .then(populateList)
}

//Populate list panel with book titles
function populateList(bookArray) {
  const listUl = document.querySelector('#list')
  bookArray.forEach(book => addTitleToList(book, listUl))
}

function addTitleToList(book, listUl) {
  let li = document.createElement('li')
  li.textContent = book.title
  li.id = book.id
  li.addEventListener('click', getBook)
  listUl.append(li)
}

//Add event to each title li element that
  //GETs book info
function getBook(event) {
  let id = event.target.id
  fetch(`http://localhost:3000/books/${id}`)
  .then(resp => resp.json())
  .then(renderBook)
}

//Clears first, then renders the book info in the show panel
  //Image, Title, Subtitle, Author, Description, list of Likes, like Button

function renderBook(bookObj) {
  bookPanel.innerHTML = ''
  
  likeArray = bookObj.users

  let img = document.createElement('img')
  let bookTitle = document.createElement('h3')
  let subTitle = document.createElement('h3')
  let bookAuth = document.createElement('h3')
  let bookDesc = document.createElement('p')
  let bookLikes = makeLikeList(bookObj.users)
  let likeButton = makeLikeButton(bookObj)

  img.src = bookObj.img_url
  bookTitle.textContent = bookObj.title
  subTitle.textContent = bookObj.subtitle
  bookAuth.textContent = bookObj.author
  bookDesc.textContent = bookObj.description


  bookPanel.append(img)
  bookPanel.append(bookTitle)
  bookPanel.append(subTitle)
  bookPanel.append(bookAuth)
  bookPanel.append(bookDesc)
  bookPanel.append(bookLikes)
  bookPanel.append(likeButton)
}

function makeLikeList(userArray) {
  let likeList = document.createElement('ul')
  for(user of userArray){
    let li = document.createElement('li')
    li.textContent = user.username
    likeList.append(li)
  }
  return likeList
}
//let bookLikes = document.createElement('ul')
  //let likeButt = document.createElement('button')

function makeLikeButton(bookObj) {
  let button = document.createElement('button')
  button.id = bookObj.id
  console.log(bookObj.users)
  if(liked) {
    button.textContent = 'Unlike'
  } else {
    button.textContent = 'Like'
  }
  button.addEventListener('click', likeAction)
  return button
}

function likeAction(event) {
  let button = event.target
  if(liked){
    console.log('unlike!')
    unlike(button.id)
  } else {
    like(button.id)
  }
}

function like(id) {
  likeArray.push(userObj)
  fetch(`http://localhost:3000/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'users': likeArray})
  })
  .then(resp => resp.json())
  .then(book => {
    liked = true
    renderBook(book)
  })
}

function unlike(id){
  console.log('unliked!')
  likeArray.pop()
  fetch(`http://localhost:3000/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'users': likeArray})
  })
  .then(resp => resp.json())
  .then(book => {
    liked = false
    renderBook(book)
  })
}

                    //Stores list of likes in global array
                    //Like button text conditional on whether user in like array
                        //Array.includes('userObj)
       //Add event to Like Button
//Like Button event:
  //Add/remove user object to likes array
  //PATCH book on server with likes array
  //change button to Unlike/Like
