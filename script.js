"use strict";
const storageKey = "moji-zadaci-v1";
const $ = selector => document.querySelector(selector);
const form = $("#task-form"), input = $("#task-input"), list = $("#task-list"), status = $("#status");
const priorities = { visok: "Visok", srednji: "Srednji", nizak: "Nizak" };
let tasks = [];
function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T12:00:00");
  return !Number.isNaN(date.getTime()) && date.getFullYear() === Number(value.slice(0,4)) && date.getMonth() + 1 === Number(value.slice(5,7)) && date.getDate() === Number(value.slice(8,10));
}
function today() {
  const now = new Date();
  return String(now.getFullYear()).padStart(4,"0") + "-" + String(now.getMonth()+1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0");
}
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!Array.isArray(saved)) throw new Error("Neispravan format");
  tasks = saved.filter(task => task && typeof task.text === "string" && typeof task.completed === "boolean").map(task => ({
    text: task.text, completed: task.completed,
    priority: Object.hasOwn(priorities, task.priority) ? task.priority : "srednji",
    due: validDate(task.due) ? task.due : ""
  }));
} catch { status.textContent = "Sačuvani zadaci nisu dostupni. Proveri da li browser dozvoljava lokalno čuvanje."; }
function saveTasks() {
  try { localStorage.setItem(storageKey, JSON.stringify(tasks)); status.textContent = ""; }
  catch { status.textContent = "Čuvanje nije uspelo. Zadaci su dostupni samo dok je ova stranica otvorena."; }
}
function normalize(text) { return text.toLocaleLowerCase("sr-Latn").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g,"dj"); }
function matches(task) {
  const state = $("#filter-status").value, priority = $("#filter-priority").value, due = $("#filter-due").value;
  return normalize(task.text).includes(normalize($("#search").value.trim())) &&
    (state === "svi" || (state === "zavrseni" ? task.completed : !task.completed)) &&
    (priority === "svi" || task.priority === priority) &&
    (due === "svi" || (due === "bez" ? !task.due : due === "danas" ? task.due === today() : task.due && task.due < today() && !task.completed));
}
function renderTasks() {
  list.replaceChildren();
  const visible = tasks.filter(matches);
  visible.forEach(task => {
    const item = document.createElement("li");
    item.className = task.completed ? "task completed" : "task";
    const label = document.createElement("label"), checkbox = document.createElement("input"), text = document.createElement("span");
    checkbox.type = "checkbox"; checkbox.checked = task.completed;
    text.className = "task-title"; text.textContent = task.text;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      const position = visible.indexOf(task);
      renderTasks();
      (list.children[Math.min(position,list.children.length-1)]?.querySelector("input") || input).focus();
    });
    label.append(checkbox, text);
    const content = document.createElement("div"); content.className = "task-content"; content.append(label);
    const meta = document.createElement("div"); meta.className = "task-meta";
    const badge = document.createElement("span"); badge.className = "badge " + task.priority; badge.textContent = priorities[task.priority] + " prioritet"; meta.append(badge);
    const date = document.createElement(task.due ? "time" : "span");
    if (task.due) {
      date.dateTime = task.due;
      const overdue = !task.completed && task.due < today();
      date.className = overdue ? "due overdue" : "due";
      date.textContent = (overdue ? "Prekoračen rok · " : "Rok · ") + new Intl.DateTimeFormat("sr-Latn-RS", {day:"numeric",month:"short",year:"numeric"}).format(new Date(task.due + "T12:00:00"));
    } else { date.className = "due"; date.textContent = "Bez roka"; }
    meta.append(date); content.append(meta);
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "delete-button"; remove.textContent = "Obriši";
    remove.setAttribute("aria-label", "Obriši zadatak: " + task.text);
    remove.addEventListener("click", () => {
      const position = visible.indexOf(task);
      tasks.splice(tasks.indexOf(task),1); saveTasks(); renderTasks();
      (list.children[Math.min(position,list.children.length-1)]?.querySelector("button") || input).focus();
    });
    item.append(content,remove); list.append(item);
  });
  $("#empty-state").hidden = visible.length > 0;
  $("#empty-state h3").textContent = tasks.length ? "Nema odgovarajućih zadataka" : "Prostor za tvoje planove";
  $("#empty-state p").textContent = tasks.length ? "Promeni pretragu ili poništi filtere." : "Dodaj prvi zadatak i kreni malim koracima.";
  const done = tasks.filter(task => task.completed).length;
  $("#total-count").textContent = tasks.length; $("#active-count").textContent = tasks.length-done; $("#done-count").textContent = done;
  $("#counter").textContent = "Prikazano " + visible.length + " od " + tasks.length;
}
input.addEventListener("input", () => input.setCustomValidity(""));
form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) { input.setCustomValidity("Unesi naziv zadatka."); input.reportValidity(); return; }
  tasks.push({text, completed:false, priority:$("#task-priority").value, due:$("#task-due").value});
  saveTasks(); renderTasks(); form.reset(); input.focus();
});
$("#search").addEventListener("input",renderTasks);
["#filter-status","#filter-priority","#filter-due"].forEach(selector => $(selector).addEventListener("change",renderTasks));
$("#reset-filters").addEventListener("click", () => {
  $("#search").value = "";
  ["#filter-status","#filter-priority","#filter-due"].forEach(selector => $(selector).value = "svi"); renderTasks();
});
// Osvežava oznake rokova i kada stranica ostane otvorena preko ponoći.
let lastDay = today();
setInterval(() => {
  if (today() !== lastDay) { lastDay = today(); renderTasks(); }
},60000);
renderTasks();
