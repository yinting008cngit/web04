// 取得 <section> 標籤，用來放所有待辦事項
let section = document.querySelector("section");

// 取得表單中的按鈕（新增待辦用）
let add = document.querySelector("form button");

// 監聽新增按鈕的點擊事件
add.addEventListener("click", e => {
    e.preventDefault(); // 防止表單提交後重新整理頁面

    // 取得表單中的輸入值
    let form = e.target.parentElement;
    let todoText = form.children[0].value;  // 待辦內容
    let todoYear = form.children[1].value;  // 年份
    let todoMonth = form.children[2].value; // 月份
    let todoDate = form.children[3].value;  // 日期

    // 若內容未輸入，跳出警告並結束
    if(todoText === ""){
        alert("請輸入事項");
        return;
    }

    // --- 建立待辦項目（HTML 元素） ---
    let todo = document.createElement("div");
    todo.classList.add("todo");  // 加上 class 以便樣式設定

    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;  // 顯示輸入的事項文字

    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoYear + "/" + todoMonth + "/" + todoDate; // 顯示日期

    // --- 建立完成按鈕 ---
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>'; // FontAwesome 圖示

    // 點擊完成按鈕：切換 "done" 樣式
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        console.log(todoItem);
        todoItem.classList.toggle("done"); // 加上或移除已完成效果
    });

    // --- 建立刪除按鈕 ---
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    // 點擊刪除按鈕事件
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        // 等待動畫結束後再移除項目
        todoItem.addEventListener("animationend", () => {
            let text = todoItem.children[0].innerText; // 找到對應文字
            let myListArr = JSON.parse(localStorage.getItem("list")); // 取得目前 localStorage 清單
            // 找到對應項目刪除
            myListArr.forEach((item,index) => {
                if(item.todoText == text){
                    myListArr.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArr)); // 更新 localStorage
                }
            });
            console.log(text);
            console.log(myListArr);
            todoItem.remove(); // 從畫面移除
        });
        todoItem.style.animation = "scaleDown 0.5s forwards"; // 播放縮小動畫
    });
    
    // 將文字、日期、按鈕加入到 todo 容器中
    todo.appendChild(text);
    todo.appendChild(time);
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    // 播放新增動畫
    todo.style.animation = "scaleUp 0.5s forwards";

    // --- 將待辦內容存入 localStorage ---
    let myTodo = {
        todoText: todoText,
        todoYear: todoYear,
        todoMonth: todoMonth,
        todoDate: todoDate,
    };

    let myList = localStorage.getItem("list");
    if(myList == null){
        // 若 localStorage 沒有資料，建立新陣列
        localStorage.setItem("list", JSON.stringify([myTodo]));
    }else{
        // 若已有資料，取出後加入新項目再存回
        let myListArr = JSON.parse(myList);
        myListArr.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArr));
    }
    
    // 檢查 localStorage 狀態
    console.log(JSON.parse(localStorage.getItem("list")));

    // 清空表單輸入欄位
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";
    form.children[3].value = "";

    // 將新的 todo 元素加入畫面上
    section.appendChild(todo);
});

// --- 載入 localStorage 中的待辦資料 ---
function loadData(){
    let myList = localStorage.getItem("list");
    if (myList !== null){
        section.innerHTML = "";
        let myListArr = JSON.parse(myList);
        myListArr.forEach(item => {

            // 以下邏輯與上方建立 todo 幾乎相同
            let todo = document.createElement("div");
            todo.classList.add("todo");

            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;

            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;

            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

            completeButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                console.log(todoItem);
                todoItem.classList.toggle("done");
            });

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.addEventListener("animationend", () => {
                    let text = todoItem.children[0].innerText;
                    let myListArr = JSON.parse(localStorage.getItem("list"));
                    myListArr.forEach((item,index) => {
                        if(item.todoText == text){
                            myListArr.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArr));
                        }
                    });
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
        })
    }
}
loadData(); // 一開始載入資料

// --- 重複載入一次（似乎為了確保畫面更新） ---
let myList = localStorage.getItem("list");
if (myList !== null){
    section.innerHTML = ""; // 先清空畫面
    
    let myListArr = JSON.parse(myList);
    myListArr.forEach(item => {

        // 再次建立 todo 元素（同上）
        let todo = document.createElement("div");
        todo.classList.add("todo");

        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;

        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;

        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

        completeButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            console.log(todoItem);
            todoItem.classList.toggle("done");
        });

        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        trashButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.addEventListener("animationend", () => {
                let text = todoItem.children[0].innerText;
                let myListArr = JSON.parse(localStorage.getItem("list"));
                myListArr.forEach((item,index) => {
                    if(item.todoText == text){
                        myListArr.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArr));
                    }
                });
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
    })
}

// --- 合併排序 (Merge Sort) 用來依日期排序 ---
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    // 比較年份、月份、日期，依序由小到大排序
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

    // 把剩下的元素補上
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

// --- 遞迴拆分陣列進行 Merge Sort ---
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

// --- 點擊排序按鈕後進行日期排序 ---
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {

    // 對 localStorage 的清單做 merge sort
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // 清空畫面上的所有項目
    let len = section.children.length;
    for(let i = 0; i < len; i++){
        section.children[0].remove();
    }

    // 重新載入排序後的資料
    loadData();
})