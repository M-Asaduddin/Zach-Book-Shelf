const readlist = [];

const RENDER_ELEMENT = 'render-readlist';

const STORAGE_KEY = 'READ_LIST';


document.addEventListener('DOMContentLoaded', ()=>{
    const AddForm = document.getElementById('inputBook');
    
    AddForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        
    });
});

document.addEventListener(SAVE_TO_STORAGE, () => {

});

const addReadList = () => {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').value;

    const readlistObject = generateReadList(+new Date(), bookTitle, bookAuthor, bookYear, bookIsComplete);

    readlist.push(readlistObject);

    document.dispatchEvent(new Event(RENDER_ELEMENT));
    saveData();
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