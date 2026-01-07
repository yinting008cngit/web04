let add = document.querySelector("form button");
let section = document.querySelector("section");

//新增代辦事項
add.addEventListener("click", (e) => {
  e.preventDefault();

  console.log(e.target.parentElement[0]);
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoYear = form.children[1].value;
  let todoMonth = form.children[2].value;
  let todoDate = form.children[3].value;

  if (todoText === "") {
    alert("請輸入代辦事項");
    return;
  }

  let todo = document.createElement("div");
  todo.classList.add("todo");

  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;

  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoYear + "/" + todoMonth + "/" + todoDate;



  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-person-circle-check"></i>';

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-recycle"></i>';

  todo.appendChild(text);
  todo.appendChild(time);
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  //forwards 動畫完成後 停在最後一個影格
  todo.style.animation = "scaleUp 0.3s forwards";

  section.appendChild(todo);

  //新增事項後清空輸入框
  form.children[0].value = "";

  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });
/* ==================================================== */
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    let text = todoItem.children[0].innerText;
    let myListArray = JSON.parse(localStorage.getItem("list"));
    myListArray.forEach((item, index) => {
      if (item.todoText == text) {
        myListArray.splice(index, 1);
        localStorage.setItem("list", JSON.stringify(myListArray));
      }
    });
    todoItem.addEventListener("animationend", () => {
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  //將資料以陣列方式存入localStorage
  let myTodo = {
    todoText: todoText,
    todoYear: todoYear,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  console.log(JSON.parse(localStorage.getItem("list")));
});

//重新開啟網頁時讀取localStorage資料
function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText =
        item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML =
        '<i class="fa-solid fa-person-circle-check"></i>';
      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });
      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-recycle"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        let text = todoItem.children[0].innerText;
        let myListArray = JSON.parse(localStorage.getItem("list"));
        myListArray.forEach((item, index) => {
          if (item.todoText == text) {
            myListArray.splice(index, 1);
            localStorage.setItem("list", JSON.stringify(myListArray));
          }
        });
        todoItem.addEventListener("animationend", () => {
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      todo.style.animation = "scaleUp 0.3s forwards";

      section.appendChild(todo);
    });
  }
}
loadData();

//MergeSort合併排序演算法
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoYear) > Number(arr2[j].todoYear)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoYear) < Number(arr2[j].todoYear)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoYear) == Number(arr2[j].todoYear)) {
      if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
        result.push(arr2[j]);
        j++;
      } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
        result.push(arr1[i]);
        i++;
      } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
        if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
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
    result.push(arr1[j]);
    j++;
  }
  return result;
}
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(left), mergeSort(right));
  }
}

//排序代辦事項
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  let sorteArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sorteArray));

  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }
  loadData();
});
