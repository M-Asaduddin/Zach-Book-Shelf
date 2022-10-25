const readlist = [];

const RENDER_EVENT = 'render-readlist';

const STORAGE_KEY = 'READ_LIST';


document.addEventListener('DOMContentLoaded', ()=>{
    const AddForm = document.getElementById('inputBook');
    const searchTrigger = document.getElementById('magnifier');
    const searchForm = document.getElementById('searchBook');
    const completeCheckBox = document.getElementById('inputBookIsComplete');
    const result = document.getElementById('search_result');
    const bookList = document.querySelector("#search_result > .book_shelf > .book_list");
    result.style.display = 'none';

    AddForm.addEventListener('submit', ()=>{

        addReadList();
    });

    
    searchTrigger.addEventListener('click', ()=>{
        const icon = document.querySelector('#magnifier>path');
        if(result.style.display === 'none'){
            result.style.display = 'flex';
            document.body.style.overflowY = 'hidden';
            icon.setAttribute('d', 'M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z');
        } else {
            bookList.innerHTML = "";
            result.style.display = 'none';
            document.body.style.overflowY = 'auto';
            icon.setAttribute('d', 'M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z');
            document.getElementById('searchBookTitle').value = '';
        }

    });

    searchForm.addEventListener('RENDER_SEARCH', () => {
        bookList.innerHTML = "";

        const searchedBook = searchTitle();
        if(searchedBook != null){
            for(const book of searchedBook){
                const renderedBook = renderReadlist(book);
                bookList.append(renderedBook);
            }
        } else {
            alert('Buku yang dicari tidak ditemukan!');
        }
    });

    searchForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        searchForm.dispatchEvent(new Event('RENDER_SEARCH'));
    });

    completeCheckBox.addEventListener('change', () => {
        const spanText = document.querySelector('.input_section > form > button > span');
        if(completeCheckBox.checked){
            spanText.innerHTML = "Selesai Dibaca";
        } else {
            spanText.innerHTML = "Belum Selesai Dibaca";
        }
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
    const bookIsComplete = document.getElementById('inputBookIsComplete');

    if(bookIsComplete.checked){
        const readlistObject = generateReadList(+new Date(), bookTitle, bookAuthor, bookYear, true);
        readlist.push(readlistObject);
    } else {
        const readlistObject = generateReadList(+new Date(), bookTitle, bookAuthor, bookYear, false);
        readlist.push(readlistObject);
    }


    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const addToCompleted = (id) => {
    const book = findReadlist(id);
    
    if(book == null) return;

    book.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    const searchForm = document.getElementById('searchBook');
    searchForm.dispatchEvent(new Event('RENDER_SEARCH'));
    saveData();
}

const undoFromComplete = (id) => {
    const book = findReadlist(id);

    if(book == null) return;

    book.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    const searchForm = document.getElementById('searchBook');
    searchForm.dispatchEvent(new Event('RENDER_SEARCH'));
    saveData();
}

const deleteBook = (id) => {
    const bookIndex = findReadlistIndex(id);

    if(bookIndex === -1) return;

    readlist.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    const searchForm = document.getElementById('searchBook');
    searchForm.dispatchEvent(new Event('RENDER_SEARCH'));
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
        const isDelete = confirm(`Yakin Ingin Menghapus buku ${book.title} dari Bookshelf?`);
        if(isDelete) {
            deleteBook(book.id);
        }
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

const searchTitle = () => {
    const searchedBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const titleSplit = searchedBook.split(' ');
    const books = readlist.filter(book =>{
        for(const segment of titleSplit){
            return book.title.toLowerCase().includes(segment);
        }
    });
    if(books.length >0 ) return books;
    return null;
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