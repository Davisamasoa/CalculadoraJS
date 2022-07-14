class CalcController {
    #locale;
    #timeEl;
    #dateEl;
    #displaycalcEl;
    #currentDate;
    #operation;
    #lastOperator;
    #lastNumber;

    constructor(){
        this.#operation = [];
        this.#locale = "pt-BR";
        this.#timeEl = document.querySelector(".time");
        this.#dateEl = document.querySelector(".date");
        this.#displaycalcEl = document.querySelector(".display");
        this.#currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.#lastOperator = "";
        this.#lastNumber = "";
        this.initKeyboard();    
    }

    pasteFromClipBoard(){
        document.addEventListener("paste", e=>{
            let text = e.clipboardData.getData("Text");
            this.displayCalc = parseFloat(text);
            console.log(text);

        })
    }


    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();
    }

    initKeyboard(){
        document.addEventListener("keyup", e=> {
            switch (e.key) {
            
                case "Escape":
                    this.clearAll()
                    break;
                
                case "Backspace":
                    this.clearEntry();
                    break;
    
                case "c":
                    if(e.ctrlKey) this.copyToClipBoard();
                    break;

                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
    
                case "Enter":
                case "=":
                    this.calc();
                    break;
    
                case ".":
                case ",":
                    this.addDot(".");
                    break;
    
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
                    break;
            }
        }
        )
    };

    
    addEventListenerAll(element, events, fn){
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    };
    
    clearAll(){
        this.#operation = [];
        this.#lastNumber = "";
        this.#lastOperator = "";
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this.#operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this.#operation[this.#operation.length - 1];
    }

    setLastOperation(value){
        this.#operation[this.#operation.length - 1] = value;
    }
    
    isOperator(value){
        return (["+", "-", "*", "%", "/"].indexOf(value) > -1);       
    }

    pushOperation(value){
        this.#operation.push(value);
        if (this.#operation.length > 3) {
            this.calc();
        }
    }
    
    getResult(){
        try{
        return eval(this.#operation.join(""));
        } catch(e){
          setTimeout(() => {
            this.setError();
          }, 0.5);
        }
    }
    
    calc(){
        let last = "";
        this.#lastOperator = this.getLastItem();
        
        if (this.#operation.length < 3) {
            let firstItem = this.#operation[0];
            this.#operation = [firstItem, this.#lastOperator, this.#lastNumber];
        }
        
        if (this.#operation.length > 3) {
            last = this.#operation.pop();
            this.#lastNumber = this.getResult();
        }

        else if (this.#operation.length == 3) {
            this.#lastNumber = this.getLastItem(false );
        }

        let result = this.getResult();
        
        if (last == "%") {
            result /= 100;
            this.#operation = [result];
        } else{
            this.#operation = [result];
            if (last) this.#operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){

        let lastItem;
        
        for (let i = this.#operation.length-1; i >= 0; i--){
            if (this.isOperator(this.#operation[i]) == isOperator) {
                lastItem = this.#operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this.#lastOperator : this.#lastNumber;
        }

        if (!lastItem){
            lastItem = (isOperator) ? this.#lastOperator : this.#lastNumber;
        }

        return lastItem;
    }
    
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }
    
    addOperation(value){
        
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } 
            
            else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } 
        
        else {
            if(this.isOperator(value)) {
                this.pushOperation(value);
            } else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }
    }

    get arrayOperation(){
        return this.#operation;
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === "string" && lastOperation.split("").indexOf (".") > -1) return;
       
       
        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastOperation.toString() + ".");
        }
        this.setLastNumberToDisplay();
    }
    
    setError (){
        this.displayCalc = "ERROR";
    }
    
    execBtn(value){
        switch (value) {
            
            case "AC":
                this.clearAll()
                break;
            
            case "CE":
                this.clearEntry();
                break;

            case "Porcentagem":
                this.addOperation("%");
                break;

            case "Divisao":
                this.addOperation("/");
                break;

            case "Multiplicaçao":
                this.addOperation("*");
                break;

            case "Menos":
                this.addOperation("-");
                break;

            case "Mais":
                this.addOperation("+");
                break;

            case "Igual":
                this.calc();
                break;

            case "Ponto":
                this.addDot(".");
                break;


            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            
            default:
                this.setError();
                break;
        }
    }
    
    initButtonsEvents(){
        let buttons = document.querySelectorAll("button");
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e=>{
                let textBtn = btn.className.replace("botao", "");
                this.execBtn(textBtn);
            })
        })
    };

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this.#locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this.#locale);
    }

    get displayTime(){
        return this.#timeEl.innerHTML;
    }
    
    set displayTime(value){
        this.#timeEl.innerHTML = value;
    }
    
    get displayDate(){
        return this.#dateEl.innerHTML;
    }
    
    set displayDate(value){
        this.#dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this.#displaycalcEl.innerHTML;
    }

    set displayCalc(value){
        if (value.toString().length > 13) {
            this.setError();
            return false;
        }
        this.#displaycalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    };

    set currentDate(value){
        this.#currentDate.innerHTML = value;
    }
}