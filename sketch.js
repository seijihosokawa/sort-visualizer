let regularArr, columnWidth, count, sorter, isReset;
let states = [];    //states determines the color

var slider = document.getElementById("arrayControlRange");
slider.addEventListener('input', setup);

//set up is run at page load
function setup() {
    createCanvas(windowWidth-200, windowHeight-500).center();
    count = 0;
    printSlider();
    printSwaps();
    clearColors();

    regularArr = Array(int(slider.value)).fill().map(() => random(1));
    columnWidth = width / regularArr.length;
    shuffle(regularArr, true); // force modifications to passed array
}
//draw function
function draw(){
    background(255);
    for(let i = 0; i < regularArr.length; i++){
        let columnHeight = map(regularArr[i], 0, 1, 0, height);
        if (states[i] === 0) {
            fill(255, 0, 0)
        } else if (states[i] === 1) {
            fill(100, 200, 50)
        } else {
            fill(25)
        }
        rect(i * columnWidth, height, columnWidth, -columnHeight);
    }
}
//start function called when start button is pressed, in-place algos are the only ones impletmented as there was no way to pass the draw function a different array to draw (mergesort and quicksort use subarrays)
function start(){
    var e = document.getElementById("algoSelector");
    var index =  e.options[e.selectedIndex].value;
    print("Index: "+index);
    if(index == 0){
        document.getElementById("heading").innerHTML = "Bubble Sort";
        bubbleSort();
    }
    else if(index == 1){
        document.getElementById("heading").innerHTML = "Insertion Sort";
        insertionSort();
    }
    else if(index == 2){
        document.getElementById("heading").innerHTML = "Selection Sort";
        selectionSort();
    }
    else if(index == 3){
        document.getElementById("heading").innerHTML = "Radix Sort";
        radixSort();
    }
    else if(index == 4){
        document.getElementById("heading").innerHTML = "Shell Sort";
        shellSort();
    }
    else if(index == 5){
        document.getElementById("heading").innerHTML = "Cycle Sort";
        cycleSort();
    }
    else{
        alert("Error: You must select a sorting algorithm.");
    }
}
//this prints the number below the slider showing the exact value
function printSlider(){
    document.getElementById("sliderOutput").innerHTML = slider.value;
    //print("Slider Value: "+slider.value);
}
//counts and shows the amount of comparisons or swaps made
function printSwaps(){
    document.getElementById("count").innerHTML = count;
    count++;
}

async function bubbleSort(){
    for(let i = regularArr.length - 1; i > 0; i--){
        for(let j = 0;j < i; j++){
            if(regularArr[j] >= regularArr[j + 1]){
                states[j+1] = 0;
                swap(j, j + 1);
                printSwaps();
                await sleep(7);
                redraw();
            }
            states[j] = 2;
        }
        states[i] = 1;
    }
    states[0] = 1;
}

async function insertionSort(){
    for(let i = 1; i < regularArr.length;i++){
        var key = regularArr[i];
        var j = i - 1;
        
        while(j >= 0 && regularArr[j] > key){
            states[j] = 0;
            regularArr[j + 1] = regularArr[j];
            
            printSwaps();
            await sleep(15);
            redraw();
            states[j] = -1;
            j--;
        }
        regularArr[j + 1] = key;
    }
    sortFinished();
}

async function selectionSort(){
    for(let i = 0;i < regularArr.length; i++){
        var minIndex = i;
        for(let j = i + 1;j < regularArr.length; j++){
            if(regularArr[j] < regularArr[minIndex]){
                minIndex = j;
            }
        }
        if(minIndex != i){
            states[i] = 0;
            swap(minIndex, i);
            printSwaps();
            await sleep(30);
            redraw();
        }
        states[i] = 1;
    }
}
//radix sort is difficult to show as the buckets cannot be shown on the canvas
async function radixSort(){
    const maxNum = Math.max(...regularArr) * 1000000; // multiplying by 1,000,000 because array values are between 0 - 1 and does not sort completely as there are 16 digits after the 0
    //print(maxNum);
    let divisor = 10;
    while(divisor < maxNum){
        let buckets = [...Array(10)].map(() => []);
        for(let num of regularArr){
            buckets[Math.floor(((num * 100000) % divisor)/(divisor / 10))].push(num);   //dividing by 100,000 because array value was multiplied by 1,000,000
            printSwaps();
            await sleep(15);
            redraw();
        }
        regularArr = [].concat.apply([], buckets);
        divisor *= 10;
    }
    sortFinished();
}

async function shellSort(){
    for(let gapSize = Math.floor(regularArr.length / 2);gapSize > 0;gapSize = Math.floor(gapSize / 2)){
        for(let index = gapSize;index < regularArr.length;index++){
            let indexCopy = index;
            let itemVal = regularArr[index];
            
            while(indexCopy >= gapSize && regularArr[indexCopy - gapSize] > itemVal){
                regularArr[indexCopy] = regularArr[indexCopy - gapSize];
                states[index] = 0;
                indexCopy -= gapSize;
                printSwaps();
                await sleep(15);
                redraw();
                states[index] = -1;
                states[indexCopy] = -1;
            }
            regularArr[indexCopy] = itemVal;
        }
    }
    sortFinished();
}

async function cycleSort(){
    for(let index = 0; index < regularArr.length;index++){
        let value = regularArr[index]
        let indexCopy = index;
        for(let i = index + 1;i < regularArr.length;i++){
            if(regularArr[i] < value){
                indexCopy++;
            }
        }
        if(indexCopy == index){
            continue;
        }
        while(value == regularArr[indexCopy]){
            indexCopy++;
        }
        printSwaps();
        await sleep(30);
        redraw();
        let temp = regularArr[indexCopy];
        regularArr[indexCopy] = value;
        value = temp;

        while(indexCopy != index){
            indexCopy = index;
            for(let i = index + 1;i < regularArr.length;i++){
                if(regularArr[i] < value){
                    indexCopy++;
                }
            }
            while(value == regularArr[indexCopy]){
                indexCopy++;
            }
            states[indexCopy] = 0;
            printSwaps();
            await sleep(30);
            redraw();
            let temp = regularArr[indexCopy];
            regularArr[indexCopy] = value;
            value = temp;
            states[indexCopy] = -1;
        }
    }
    sortFinished();
}
//changes all the states back -1, which will fill the bars to black
function clearColors(){
    if(states.length != 0){
        for(var i = 0; i < states.length;i++){
            states[i] = -1;
        }
    }
}
//turn array green once its is sorted
async function sortFinished(){
    for(let i = 0; i < regularArr.length;i++){
        await sleep(15);
        states[i] = 1;
    }
}
//swap function
function swap(l, k){
    var temp = regularArr[l];
    regularArr[l] = regularArr[k];
    regularArr[k] = temp;
}
//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

