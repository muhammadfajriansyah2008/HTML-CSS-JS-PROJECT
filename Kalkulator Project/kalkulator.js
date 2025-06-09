const tampilan = document.getElementById("tampilan");
let currentInput = "";
let shouldResetScreen = false;

function untukDitampilkan(input) {
    if (shouldResetScreen) {
        tampilan.value = "";
        shouldResetScreen = false;
    }
    
    if (input === "Math.PI") {
        tampilan.value = Math.PI;
        return;
    }
    
    if (["+", "*", "/"].includes(input) && tampilan.value === "") {
        return;
    }
    
    if (input === "-" && tampilan.value === "") {
        tampilan.value = "-";
        return;
    }
    
    const lastChar = tampilan.value.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar) && 
        ["+", "-", "*", "/"].includes(input)) {
        tampilan.value = tampilan.value.slice(0, -1) + input;
        return;
    }
    
    if (input === ".") {
        const parts = tampilan.value.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) {
            return;
        }
    }
    
    if (input === "00" && tampilan.value === "") {
        return;
    }
    
    tampilan.value += input;
    currentInput = tampilan.value;
}

function menghapusAngka() {
    if (tampilan.value.length > 0) {
        tampilan.value = tampilan.value.slice(0, -1);
        currentInput = tampilan.value;
    }
}

function menghapusSemuaAngka() {
    tampilan.value = "";
    currentInput = "";
    shouldResetScreen = false;
}

function kalkulasi() {
    try {
        let expression = tampilan.value.replace(/×/g, "*").replace(/÷/g, "/");

        const result = eval(expression);
        
        // Tampilkan hasil
        tampilan.value = result.toString();
        currentInput = tampilan.value;
        shouldResetScreen = true;
    } catch (error) {
        tampilan.value = "Error";
        currentInput = "";
        shouldResetScreen = true;
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        untukDitampilkan(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        untukDitampilkan(key);
    } else if (key === '.') {
        untukDitampilkan('.');
    } else if (key === 'Enter' || key === '=') {
        kalkulasi();
    } else if (key === 'Backspace') {
        menghapusAngka();
    } else if (key === 'Escape') {
        menghapusSemuaAngka();
    } else if (key === 'p' || key === 'P') {
        untukDitampilkan('PHI'); 
    }

    // PHI DISINI GA BERFUNGSI, MAAF YAAAAA:D
    // PHI DISINI GA BERFUNGSI, MAAF YAAAAA:D
    // PHI DISINI GA BERFUNGSI, MAAF YAAAAA:D
});