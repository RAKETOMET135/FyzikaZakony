const questionText = document.querySelector("#question")
const userInput = document.querySelector("#user-input")
const submit = document.querySelector("#submit")

let loadedData
let currentSet = []
let currentQuestion

async function loadData(onLoadHandler) {
    const response = await fetch("data.json")
    const data = await response.json()

    onLoadHandler(data)
}

function onDataLoaded(data) {
    loadedData = data

    displayNewQuestion()
}

function createNewSet() {
    for (const law of loadedData.laws) {
        const question = {
            name: law.name,
            answer: law.exact
        }

        currentSet.push(question)
    }
}

function pickFromSet() {
    const rn = Math.floor(Math.random() * currentSet.length)
    const setElement = currentSet.splice(rn, 1)[0]

    return setElement
}

function pickNewQuestion() {
    if (currentSet.length === 0) {
        createNewSet()
    }

    currentQuestion = pickFromSet()
}

function displayNewQuestion() {
    userInput.value = ""
    submit.textContent = "Zkontrolovat"

    if (userInput.classList.contains("incorrect")) {
        userInput.classList.remove("incorrect")
    }

    pickNewQuestion()

    questionText.textContent = currentQuestion.name
}

function submitAnswer() {
    if (userInput.classList.contains("incorrect")) {
        displayNewQuestion()

        return
    }

    const userText = userInput.value.toLowerCase()
    const correctAnswer = currentQuestion.answer.toLowerCase()
    
    if (userText === correctAnswer) {
        displayNewQuestion()
    }
    else {
        userInput.classList.add("incorrect")
        userInput.value += " => " + currentQuestion.answer
        submit.textContent = "Další"
    }
}

function main() {
    loadData(onDataLoaded)

    submit.addEventListener("click", submitAnswer)

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return
        if (document.activeElement === userInput && !e.shiftKey) return

        e.stopPropagation()
        e.preventDefault()

        submitAnswer()
    })
}

main()