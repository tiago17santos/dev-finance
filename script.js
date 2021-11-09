const Modal = {
    open(){
        // abri modal e add classe active
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },

    close(){
        //fechar modal e remove classe active
        document
        .querySelector('.modal-overlay')
        .classList.remove('active')
    }
}

const transactions = [
    {
        id: '1',
        description: 'Luz',
        amount: -50001,
        date: '23/01/2021'
    },
    {
        id: '2',
        description: 'Website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id: '3',
        description: 'Internet',
        amount: -20012,
        date: '23/01/2021'
    },
    {
        id: '4',
        description: 'App',
        amount: 200000,
        date: '23/01/2021'
    },
]

const Transaction = {
    incomes(){
        let income = 0

        transactions.forEach(transaction =>{
            if(transaction.amount > 0){
                income += transaction.amount 
            }
        })
        
        return income  
    },

    expense(){
        let expense = 0

        transactions.forEach(transaction =>{
            if(transaction.amount < 0){
                expense += transaction.amount 
            }
        })
        
        return expense 
    },

    total(){
        return Transaction.incomes() + Transaction.expense()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innertHTMLTransaction(transaction) 
        
        DOM.transactionsContainer.appendChild(tr)
    },

    innertHTMLTransaction(transaction){
        const cssClasses = transaction.amount > 0 ? 'income' : 'expense'
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Imagem excluir descrição"></td>
            `
        return html
    },

    updateBalance(){
        document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expense())
        document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    }
}



const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})

        return signal + value
    }
}

transactions.forEach(transaction => {
    DOM.addTransaction(transaction)
})

DOM.updateBalance()