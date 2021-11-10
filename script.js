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
/*
const transactions = [
    {
        description: 'Luz',
        amount: -50001,
        date: '23/01/2021'
    },
    {
        description: 'Website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        description: 'Internet',
        amount: -20012,
        date: '23/01/2021'
    },
    {
        description: 'App',
        amount: 200000,
        date: '23/01/2021'
    },
]*/

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transaction')) || []
    },

    set(transactions){
        localStorage.setItem('dev.finances:transaction', JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0

        Transaction.all.forEach(transaction =>{
            if(transaction.amount > 0){
                income += transaction.amount 
            }
        })
        
        return income  
    },

    expense(){
        let expenses = 0

        Transaction.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expenses += transaction.amount 
            }
        })
        
        return expenses
    },

    total(){
        return Transaction.incomes() + Transaction.expense()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innertHTMLTransaction(transaction, index) 
        tr.dataset.index = index
        
        DOM.transactionsContainer.appendChild(tr)
    },

    innertHTMLTransaction(transaction, index){
        const cssClasses = transaction.amount > 0 ? 'income' : 'expense'
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Imagem excluir descrição"></td>
            `
        return html
    },

    updateBalance(){
        document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expense())
        document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransaction(){
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatAmount(amount){
        amount = Number(amount) * 100

        return amount
    },

    formatData(date){
        const splitDate = date.split('-')

        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatData(){
        let { description, amount, date} = Form.getValues()
       
        amount = Utils.formatAmount(amount)
        date = Utils.formatData(date)

        return {
            description,
            amount,
            date
        }
    },

    validateField(){
        const { description, amount, date} = Form.getValues()
        
        if(description.trim() === '' || amount.trim() === '' || date.trim() === ''){
            throw new Error("Por favor preencha todos os campos")
        }
    },

    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event){
        event.preventDefault()
        try{
            
            Form.validateField()
            const transaction = Form.formatData()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()  

        } catch(e){
            alert(e.message)
        }
          
    }
}


const App = {
    init() {
        //Por possuir os mesmos parametros (transaction, index), 
        //pode-se passar a "DOM.addTransaction" como atalho (e não executando) na execução do forEach
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },

    reload(){
        DOM.clearTransaction()
        App.init()
    }
}

App.init()

