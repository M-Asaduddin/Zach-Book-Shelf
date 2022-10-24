const readlist = [];

const RENDER_EVENT = 'render-readlist';

const STORAGE_KEY = 'READ_LIST';


document.addEventListener('DOMContentLoaded', ()=>{
    const AddForm = document.getElementById('inputBook');
    
    AddForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        addReadList();
    });

    if(isStorageExist()){
        loadData();
    }
});

document.addEventListener(RENDER_EVENT, ()=>{
    const incompleted = document.getElementById("incompleteBookshelfList");
    incompleted.innerHTML = '';

    const completed = document.getElementById("completeBookshelfList");
    completed.innerHTML = '';

    for(const book of readlist){
        const bookItem = renderReadlist(book);

        if(book.isCompleted){
            completed.append(bookItem);
        } else {
            incompleted.append(bookItem);
        }
    }
});

const addReadList = () => {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').value;

    const readlistObject = generateReadList(+new Date(), bookTitle, bookAuthor, bookYear, false);

    readlist.push(readlistObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const addToCompleted = (id) => {
    const book = findReadlist(id);
    
    if(book == null) return;

    book.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undoFromComplete = (id) => {
    const book = findReadlist(id);

    if(book == null) return;

    book.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const deleteBook = (id) => {
    const bookIndex = findReadlistIndex(id);

    if(bookIndex === -1) return;

    readlist.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const renderReadlist = (book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add('book_item');

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis : ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun : ${book.year}`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";

    deleteButton.addEventListener("click", () => {
        deleteBook(book.id);
    });
    
    if(book.isCompleted) {
        const uncompleteButton = document.createElement("button");
        uncompleteButton.classList.add("green");
        uncompleteButton.innerText = "Belum Selesai Dibaca";

        uncompleteButton.addEventListener('click', () => {
            undoFromComplete(book.id);
        });

        buttonContainer.append(uncompleteButton);
        
    } else {
        const completeButton = document.createElement("button");
        completeButton.classList.add("green");
        completeButton.innerText = "Selesai Dibaca";
        
        completeButton.addEventListener("click", () => {
            addToCompleted(book.id);
        });

        buttonContainer.append(completeButton);
    }

    buttonContainer.append(deleteButton);

    bookItem.append(bookTitle, bookAuthor, bookYear, buttonContainer);
    bookItem.setAttribute('id', `read-${book.id}`);

    return bookItem;
}

const isStorageExist = () => {
    if(typeof(Storage) === undefined){
        alert("Your Browser do not support local storage");
        return false;
    }
    return true;
};

const generateReadList = (id, title, author, year, isCompleted) => {
    return {id, title, author, year, isCompleted};
}

const saveData = () => {
    if(isStorageExist()){
        const readlistParsed = JSON.stringify(readlist);
        localStorage.setItem(STORAGE_KEY, readlistParsed);
    }
};

const findReadlist = (id) => {
    for (const book of readlist) {
        if(book.id === id){
            return book;
        }
    }
    return null;
};

const findReadlistIndex = (id) => {
    for (const index in readlist){
        if(readlist[index].id === id) return index;
    }
    return -1;
}

const loadData = () => {
    const localData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(localData);

    if(isStorageExist()){
        for(const book of data){
            readlist.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}