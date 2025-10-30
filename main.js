// Sélection des éléments
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const transactionsList = document.getElementById("transactions-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");

// Charger les transactions depuis le localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Variable pour savoir si on est en mode édition
let editId = null;

// Afficher les transactions existantes
renderTransactions();

// Événement : ajouter ou modifier une transaction
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
          ✏️
        </button>
        <button onclick="deleteTransaction(${t.id})" class="text-gray-500 hover:text-red-500">
          🗑️
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

 