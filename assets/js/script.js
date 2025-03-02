// Formu temizle
const clear = () => {
  document.getElementById("task-form").reset();
  document
    .querySelectorAll(".error-message")
    .forEach((msg) => (msg.textContent = ""));
};

// Görevleri sırala
function sortTasks(sortBy) {
  const tasks = Array.from(document.getElementById("tasks").children);
  let sortedTasks = tasks;

  if (sortBy === "date") {
    sortedTasks = tasks.sort(
      (a, b) =>
        new Date(b.getAttribute("data-created")) -
        new Date(a.getAttribute("data-created"))
    );
  } else if (sortBy === "priority") {
    const priorityOrder = { Yüksek: 1, Orta: 2, Düşük: 3 };
    sortedTasks = tasks.sort(
      (a, b) =>
        priorityOrder[a.getAttribute("data-priority")] -
        priorityOrder[b.getAttribute("data-priority")]
    );
  }

  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";
  sortedTasks.forEach((task) => taskList.appendChild(task));
}

// Tüm görevleri filtrele (ve tarihe göre sırala)
function filterAll() {
  const tasks = document.getElementById("tasks").children;
  for (let task of tasks) task.classList.remove("hidden");
  sortTasks("date");
}

// Tamamlanmış görevleri filtrele (ve tarihe göre sırala)
function filterCompleted() {
  const tasks = document.getElementById("tasks").children;
  for (let task of tasks) {
    const completedCheckbox = task.querySelector("input[type='checkbox']");
    task.classList.toggle(
      "hidden",
      !(completedCheckbox && completedCheckbox.checked)
    );
  }
  sortTasks("date");
}

// Öncelikli görevleri filtrele ve önceliğe göre sırala
function filterPriority() {
  const tasks = document.getElementById("tasks").children;
  const priorityOrder = { Yüksek: 1, Orta: 2, Düşük: 3 };

  for (let task of tasks) task.classList.remove("hidden");

  const sortedByPriority = Array.from(tasks).sort((a, b) => {
    const priorityA = a.getAttribute("data-priority");
    const priorityB = b.getAttribute("data-priority");
    if (!priorityA) return 1;
    if (!priorityB) return -1;
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  });

  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";
  sortedByPriority.forEach((task) => taskList.appendChild(task));
}

// Tarihe göre filtrele (ve sırala - aslında sadece sırala)
function filterDate() {
  const tasks = Array.from(document.getElementById("tasks").children);
  tasks.forEach((task) => task.classList.remove("hidden"));
  sortTasks("date");
}

// Görev oluştur ve listeye ekle
let gonder = function () {
  let task = document.getElementById("task-title").value;
  let taskMessage = document.getElementById("taskMessage").value;
  let priorityTask = document.getElementById("priorityTask").value;
  let tasks = document.getElementById("tasks");

  let isValid = true;
  if (!task) {
    document.getElementById("task-title").style.borderColor = "#e74c3c";
    document.getElementById("task-title-error").textContent =
      "Bu alan boş bırakılamaz.";
    isValid = false;
  } else {
    document.getElementById("task-title").style.borderColor = "";
    document.getElementById("task-title-error").textContent = "";
  }

  if (priorityTask === "Seçiniz") {
    document.getElementById("priorityTask").style.borderColor = "#e74c3c";
    document.getElementById("priority-error").textContent =
      "Lütfen bir öncelik seçiniz.";
    isValid = false;
  } else {
    document.getElementById("priorityTask").style.borderColor = "";
    document.getElementById("priority-error").textContent = "";
  }

  if (!isValid) return;

  try {
    const li = document.createElement("li");
    li.style.cssText = "list-style: none; position: relative;";

    function setColor(priority) {
      let colorMap = { Yüksek: "#ff4d4d", Orta: "#ffcc00", Düşük: "#66cc66" };
      li.style.borderLeft = `10px solid ${colorMap[priority]}`;
    }
    setColor(priorityTask);

    li.style.cssText +=
      "padding: 20px; border-radius: 8px; margin-bottom: 15px; color: #333; background-color: #f4f4f4; transition: background-color 0.3s ease;";

    const contentWrapper = document.createElement("div");
    contentWrapper.style.cssText =
      "display: flex; flex-direction: column; overflow: hidden;";

    const title = document.createElement("div");
    title.textContent = task;
    title.style.cssText =
      "font-weight: 600; font-size: 20px; margin-bottom: 10px; white-space: normal; word-wrap: break-word; overflow: hidden; max-height: 40px;";
    contentWrapper.appendChild(title);

    const description = document.createElement("div");
    description.textContent = taskMessage;
    description.style.cssText =
      "font-size: 16px; margin-bottom: 10px; white-space: normal; word-wrap: break-word; overflow: hidden;";
    contentWrapper.appendChild(description);

    const date = document.createElement("div");
    const now = new Date();
    li.setAttribute("data-created", now.toISOString());
    li.setAttribute("data-priority", priorityTask);
    date.textContent = new Date().toLocaleTimeString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    date.style.cssText =
      "font-size: 12px; color: #888; position: absolute; top: 10px; right: 10px;";
    li.appendChild(date);

    const taskStatus = document.createElement("div");
    taskStatus.style.cssText =
      "display: flex; align-items: center; margin-top: 10px;";

    const completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    const statusLabel = document.createElement("span");
    statusLabel.textContent = "Görev Tamamlandı mı?";
    statusLabel.style.cssText =
      "margin-left: 10px; font-weight: 500; font-size: 16px;";
    taskStatus.appendChild(completedCheckbox);
    taskStatus.appendChild(statusLabel);

    completedCheckbox.addEventListener("change", function () {
      li.style.backgroundColor = this.checked ? "#e0f7e0" : "#f4f4f4";
      li.style.transition = "background-color 0.3s ease";
    });

    contentWrapper.appendChild(taskStatus);
    li.appendChild(contentWrapper);

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("material-icons");
    deleteButton.textContent = "delete";
    deleteButton.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; bottom: 10px; right: 10px; cursor: pointer; font-size: 20px; color: #ff4d4d;";

    deleteButton.addEventListener("click", function (event) {
      // Silme olayı - event.target ve stopPropagation örneği
      event.stopPropagation(); // Event bubbling'i durdur
      console.log("Silinen element:", event.target); // event.target örneği - tıklanan element (burada deleteButton)
      li.remove(); // Görevi sil
    });

    li.appendChild(deleteButton);
    tasks.appendChild(li);

    clear(); // Formu temizle
    document.getElementById("title-count").textContent = "0 / 70";
    document.getElementById("message-count").textContent = "0 / 280";
  } catch (error) {
    console.error("Beklenmeyen hata:", error);
    alert("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.");
  }
};

document.getElementById("task-title").addEventListener("input", function () {
  this.style.borderColor = "";
  document.getElementById("task-title-error").textContent = "";
});

document.getElementById("priorityTask").addEventListener("change", function () {
  this.style.borderColor = "";
  document.getElementById("priority-error").textContent = "";
});

// Karakter sayısı güncelleme fonksiyonları
function updateTitleCount() {
  const titleInput = document.getElementById("task-title");
  const titleCount = document.getElementById("title-count");
  const titleLength = titleInput.value.length;
  titleCount.textContent = `${titleLength} / 70`;
  titleCount.classList.toggle("near-limit", titleLength >= 60);
  titleCount.classList.toggle("over-limit", titleLength >= 70);
}

function updateMessageCount() {
  const messageInput = document.getElementById("taskMessage");
  const messageCount = document.getElementById("message-count");
  const messageLength = messageInput.value.length;
  messageCount.textContent = `${messageLength} / 280`;
  messageCount.classList.toggle("near-limit", messageLength >= 250);
  messageCount.classList.toggle("over-limit", messageLength >= 280);
}
