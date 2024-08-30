// Element
const lists = document.querySelectorAll(".list");
const addbtns = document.querySelectorAll(".btn-add");
const inpusts = document.querySelectorAll('.task-content')
// click add btns listen
addbtns.forEach((addBtn) =>
  addBtn.addEventListener("click", (e) => {
    createItemBody(e.target);
  })
);
inpusts.forEach((input)=> {
  input.addEventListener('keyup',(e)=>{
    if(e.key !== 'Enter') return;
    createItemBody(e.target)
  })
})
// creat item body
function createItemBody(eleBtn) {
  const list = eleBtn.parentElement.parentElement;
  const userTask = list.firstElementChild.firstElementChild;
  if (userTask.value === "") return;
  // create item Element
  const itemEle = document.createElement("p");
  itemEle.classList.add("item");
  itemEle.setAttribute("draggable", true);
  // create item text
  const itemContent = document.createElement("span");
  itemContent.classList.add("item-content");
  itemContent.appendChild(document.createTextNode(`${userTask.value}`));
  // create item controls
  const itemControls = document.createElement("span");
  itemControls.classList.add("item-controls");
  itemControls.innerHTML = `
  <i class="fa fa-trash icon" aria-hidden="true" onclick = "delElement(this)"></i>
  <i class="fa fa-pencil icon" aria-hidden="true" onclick ="update(this)"></i>
  `;
  // collect all parts @ item
  itemEle.appendChild(itemContent);
  itemEle.appendChild(itemControls);
  // attach dragLogic To Element
  dragDropLogic(itemEle);
  // add new item to list
  list.append(itemEle);
  userTask.value = "";
}
// delete
function delElement(ele) {
  ele.parentElement.parentElement.remove();
}
// update Task
function update(ele) {
  const userinput =
    ele.parentElement.parentElement.parentElement.firstElementChild
      .firstElementChild;
  const taskContent = ele.parentElement.parentElement.firstElementChild;
  taskContent.parentElement.remove();
  userinput.value = taskContent.innerHTML;
}

// move Task

function dragDropLogic(ele) {
  ele.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });
  ele.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });
}
// handle list
lists.forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!e.target.classList.contains("list")) return;
    const dragList = e.target;
    const afterElement = getAfterElement(list, e.clientY);
    const dragElement = document.querySelector(".dragging");
    if(afterElement == null){
      dragList.append(dragElement);
    }
    else{
      list.insertBefore(dragElement,afterElement )
    }
  });
  list.addEventListener("dragenter", (e) => {
    e.preventDefault()
  });
  list.addEventListener("dragleave", (e) => {
    e.preventDefault();
  });
  list.addEventListener("drop", (e) => {});
});

function getAfterElement(list, y) {
  const draggableitems = [...list.querySelectorAll(".item:not(.dragging)")];

  return draggableitems.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
