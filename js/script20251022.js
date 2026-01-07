const section = document.querySelector("#todoList");
const form = document.querySelector("#todoForm");
const sortButton = document.querySelector("div.sort button");

function createTodoElement(item, saveToStorage = false){
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = item.todoText;

    const time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = `${item.todoYear}/${item.todoMonth}/${item.todoDate}`;

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.setAttribute('aria-label', '標記完成');
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

    completeButton.addEventListener("click", e => {
        const todoItem = e.target.closest('.todo');
        if(!todoItem) return;
        todoItem.classList.toggle("done");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.setAttribute('aria-label', '刪除項目');
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    trashButton.addEventListener("click", e => {
        const todoItem = e.target.closest('.todo');
        if(!todoItem) return;
        todoItem.addEventListener("animationend", () => {
            const textValue = todoItem.querySelector('.todo-text')?.innerText;
            try{
                const myListArr = JSON.parse(localStorage.getItem('list')) || [];
                const idx = myListArr.findIndex(i => i.todoText === textValue);
                if(idx > -1){
                    myListArr.splice(idx,1);
                    localStorage.setItem('list', JSON.stringify(myListArr));
                }
            }catch(err){
                console.error(err);
            }
            todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.5s forwards";
    });

    todo.appendChild(text);
    todo.appendChild(time);
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.5s forwards";
    section.appendChild(todo);

    if(saveToStorage){
        try{
            const myListArr = JSON.parse(localStorage.getItem('list')) || [];
            myListArr.push(item);
            localStorage.setItem('list', JSON.stringify(myListArr));
        }catch(err){
            console.error('localStorage write error', err);
        }
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const todoText = form.querySelector('input[name="todoText"]').value.trim();
    const dateValue = form.querySelector('input[name="todoDate"]').value;

    if(!todoText){
        alert('請輸入事項');
        return;
    }

    let todoYear = '';
    let todoMonth = '';
    let todoDate = '';
    if(dateValue){
        const d = new Date(dateValue);
        todoYear = d.getFullYear();
        todoMonth = d.getMonth() + 1;
        todoDate = d.getDate();
    }

    const myTodo = { todoText, todoYear, todoMonth, todoDate };
    createTodoElement(myTodo, true);
    form.reset();
});

function loadData(){
    try{
        const myList = JSON.parse(localStorage.getItem('list')) || [];
        section.innerHTML = '';
        myList.forEach(item => createTodoElement(item, false));
    }catch(err){
        console.error('localStorage read error', err);
    }
}

loadData();

function mergeTime(arr1, arr2) {
    const result = [];
    let i = 0, j = 0;
    while(i < arr1.length && j < arr2.length) {
        const a = arr1[i];
        const b = arr2[j];
        const aTime = Number(a.todoYear) * 10000 + Number(a.todoMonth) * 100 + Number(a.todoDate);
        const bTime = Number(b.todoYear) * 10000 + Number(b.todoMonth) * 100 + Number(b.todoDate);
        if(aTime <= bTime){
            result.push(a); i++;
        } else {
            result.push(b); j++;
        }
    }
    while(i < arr1.length) { result.push(arr1[i++]); }
    while(j < arr2.length) { result.push(arr2[j++]); }
    return result;
}

function mergeSort(arr){
    if(!Array.isArray(arr) || arr.length <= 1) return arr || [];
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    return mergeTime(mergeSort(left), mergeSort(right));
}

if(sortButton){
    sortButton.addEventListener('click', () => {
        try{
            const myList = JSON.parse(localStorage.getItem('list')) || [];
            if(myList.length === 0) return;
            const sorted = mergeSort(myList);
            localStorage.setItem('list', JSON.stringify(sorted));
            loadData();
        }catch(err){
            console.error(err);
        }
    });
}

function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;
    while(i < arr1.length && j < arr2.length) {
        if(Number(arr1[i].todoYear) > Number(arr2[j].todoYear)){
            result.push(arr2[j]);
            j++;
        } else if(Number(arr1[i].todoYear) < Number(arr2[j].todoYear)){
            result.push(arr1[i]);
            i++;
        } else if(Number(arr1[i].todoYear) == Number(arr2[j].todoYear)){
            if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        } else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
            } else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
                if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                    result.push(arr2[j]);
                    j++;
                } else {
                    result.push(arr1[i]);
                    i++;
                }
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }
    return result;
}

function mergeSort(arr){
    if(arr.length === 1){
        return arr;
    }else{
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {

    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    let len = section.children.length;
    for(let i = 0; i < len; i++){
        section.children[0].remove();
    }

    loadData();
})

