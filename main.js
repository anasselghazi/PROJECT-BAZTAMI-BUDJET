//   LES VARIABLES 
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const transactionsList = document.getElementById("transactions-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");

//  localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Variable pour modification
let editId = null;
 
// Afficher les transactions existantes
renderTransactions();

// Ajouter ou modifier une transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const transactionData = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
    date: dateInput.value,
  };

  if (editId) {
    // Modifier la transaction existante
    transactions = transactions.map((t) =>
      t.id === editId ? { ...t, ...transactionData } : t
    );
    editId = null;
    form.querySelector("button[type='submit']").textContent = "Ajouter";
  } else {
    // Ajouter une nouvelle transaction
    const transaction = {
      id: Date.now(),
      ...transactionData,
    };
    transactions.push(transaction);
  }

  saveAndRender();
  form.reset();
});

// Fonction : sauvegarder dans le localStorage
function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
}

// Fonction : afficher les transactions
function renderTransactions() {
  transactionsList.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const card = document.createElement("div");
    card.className = `p-4 rounded-xl shadow flex justify-between items-center ${
      t.type === "income" ? "bg-green-50" : "bg-red-50"
    }`;

    card.innerHTML = `
      <div>
        <p class="font-semibold">${t.description}</p>
        <p class="text-sm text-gray-500">${t.date}</p>
      </div>
      <div class="text-lg font-bold ${
        t.type === "income" ? "text-green-600" : "text-red-600"
      }">
        ${t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)} €
      </div>
      <div class="flex gap-2">
        <button onclick="editTransaction(${t.id})" class="text-blue-500 hover:text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button onclick="deleteTransaction(${t.id})" class="text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pill-bottle-icon lucide-pill-bottle"><path d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4"/><path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/><rect width="16" height="5" x="4" y="2" rx="1"/></svg>
        </button>
      </div>
    `;

    transactionsList.appendChild(card);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const balance = income - expense;

  totalIncome.textContent = `+${income.toFixed(2)} €`;
  totalExpense.textContent = `-${expense.toFixed(2)} €`;
  netBalance.textContent = `${balance.toFixed(2)} €`;
  netBalance.style.color = balance >= 0 ? "green" : "red";
}

// Supprimer une transaction
function deleteTransaction(id) {
  if (confirm("Voulez-vous vraiment supprimer cette transaction ?")) {
    transactions = transactions.filter((t) => t.id !== id);
    saveAndRender();
  }
}
// Modifier une transaction
function editTransaction(id) {
  const t = transactions.find((t) => t.id === id);
  if (!t) return;

  // Remplir le formulaire avec les données existantes
  descriptionInput.value = t.description;
  amountInput.value = t.amount;
  typeInput.value = t.type;
  dateInput.value = t.date;

  // Passer en mode édition
  editId = id;
  form.querySelector("button[type='submit']").textContent = "Modifier";
  descriptionInput.focus();
}

 