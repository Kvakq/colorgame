const stockContainer = document.getElementById("items")
const dropzoneContainer = document.getElementById("dropzones")

var level = 0
var timeUsed = 0
var timer = null

const ShapeVariants = [
    {
        id: 0,
        text: "Ruut",
        shapeClass: "",
    },
    {
        id: 1,
        text: "Ring",
        shapeClass: "circle",
    },
    {
        id: 2,
        text: "Ristkülik",
        shapeClass: "rectangle",
    },
    {
        id: 3,
        text: "Rööpkülik",
        shapeClass: "parallelogram",
    }
]

const ColorVariants = [
    {
        id: 0,
        text: 'Punane',
        colorClass: 'red'
    },
    {
        id: 1,
        text: 'Roheline',
        colorClass: 'green'
    },
    {
        id: 2,
        text: 'Sinine',
        colorClass: 'blue'
    },
    {
        id: 3,
        text: 'Lilla',
        colorClass: 'purple',
    },
    {
        id: 4,
        text: 'Roosa',
        colorClass: 'pink',
    },
    {
        id: 5,
        text: 'Oranž',
        colorClass: 'orange',
    },
    {
        id: 6,
        text: 'Kollane',
        colorClass: 'yellow',
    },
    {
        id: 7,
        text: 'Helesinine',
        colorClass: 'cyan',
    },
    {
        id: 8,
        text: 'Pruun',
        colorClass: 'brown',
    }
]

var ActiveVariants = [

]


function getItems() {
    return stockContainer.children;
}

function getDropZones() {
    return dropzoneContainer.children;
}



function generatePair(variantId) {
    const identifier = generateId()
    const variant = ColorVariants[variantId]
    const shape = getRandomShapeVariant()

    const existentVariant = ActiveVariants.find(x => x.colorClass == variant.colorClass && x.shapeClass == shape.shapeClass)
    
    if(existentVariant) return;

    generateDropZone(identifier, variant.colorClass, shape.shapeClass)
    generateDropableitem(identifier, variant.text, shape.text)
    addActiveVariant(identifier, variant.colorClass, variant.id, shape.shapeClass, shape.id)


}

function clearActiveVariants() {
    ActiveVariants = [];
}

function addActiveVariant(id, colorClass, variantId, shapeClass, shapeId) {
    ActiveVariants.push({
        id: id,
        colorClass: colorClass,
        variantId: variantId,
        shapeClass: shapeClass,
        shapeId: shapeId,
        complete: false
    })
}

function generateDropZone(id, colorClass, shapeClass) {
    const obj = document.createElement('div')
    obj.className = 'dropzone ' + colorClass + ' ' + shapeClass
    obj.id = 'dropzone-' + id
    addZoneListener(obj) // making zone listen to drops

    dropzoneContainer.append(obj)
}

function addZoneListener(zone) {
    zone.addEventListener('dragover', event => {
        event.preventDefault();
        zone.classList.add('hovered');
    });
    zone.addEventListener('dragleave', () => {
        zone.classList.remove('hovered');
    });
    zone.addEventListener('drop', event => {
        event.preventDefault();
        const draggable = document.querySelector('.dragging');
        const droppedOn = event.target;

        const correct = checkCorrectness(zone.id, draggable.id)
        //draggable.draggable = false
        if (correct) {
            const variant = ActiveVariants.find(av => av.id == getVariantId(draggable.id))
            variant.complete = true;
            draggable.className = 'item'
            draggable.draggable = false
            droppedOn.appendChild(draggable);
            if (isAllCorrect()) return newLevel();
            zone.classList.remove('hovered'); return
        }
    });
}

function isAllCorrect() {
    return ActiveVariants.every(variant => variant.complete)
}

function getVariantId(id) {
    return String(id).split('-')[1]
}

function generateDropableitem(id, text, shape) {
    const obj = document.createElement('div')
    obj.className = 'item ' + generateRandomColor()
    obj.innerText = text + " " + shape
    obj.draggable = true
    obj.id = 'item-' + id

    obj.addEventListener('dragstart', () => {
        obj.classList.add('dragging');
    });

    obj.addEventListener('dragend', () => {
        obj.classList.remove('dragging');
    });

    stockContainer.append(obj)
}

function generateId() {
    return Math.random().toString(16).slice(2)
}


function generateLevel() {
    clearLevel();
    generateUniquePair();
    generateUniquePair();
    generateUniquePair();
    generateUniquePair();
    generateUniquePair();
    for (var i = stockContainer.children.length; i >= 0; i--) {
        stockContainer.appendChild(stockContainer.children[Math.random() * i | 0]);
    }
}

function clearLevel() {
    ActiveVariants = []
    stockContainer.innerHTML = ""
    dropzoneContainer.innerHTML = ""
}

function generateUniquePair() {
    generatePair(getRandomColorId())
}

function getRandomColorId() {
    const max = getMaxColorId();
    return getRandomInt(0, max)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMaxColorId() {
    return ColorVariants.length - 1;
}

function checkCorrectness(zoneId, itemId) {
    const newZoneId = String(zoneId).split('-')[1]
    const newItemId = String(itemId).split('-')[1]
    return newZoneId == newItemId;
}

//addItemListeners(getItems())
//addZoneListeners(getDropZones())
/*
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});*/

function start() {
    setTitleScreenActive(false)
    setHeaderActive(true);
    newLevel()
}

function getRandomShapeVariant(){
    return ShapeVariants[Math.floor(Math.random() * ShapeVariants.length)]
}

function generateRandomColor() {
    return ColorVariants[Math.floor(Math.random() * ColorVariants.length)].colorClass;
}

function newLevel() {

    startTimer();
    clearLevel()
    const lvlText = document.getElementById('level')
    level += 1;
    lvlText.innerText = level
    generateLevel()
}

function startTimer() {
    if (timer) clearInterval(timer)
    const timeObj = document.getElementById('timer')
    timeUsed = 0
    const newTimer = setInterval(() => {
        timeUsed += 1
        timeObj.innerText = secondsToMMSS(timeUsed);
    }, 1000);
    timer = newTimer;
}

function secondsToMMSS(seconds) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
}


function setTitleScreenActive(active) {
    const titleScreen = document.getElementById('title-screen');
    const body = document.body;
    titleScreen.style.display = active ? "flex" : "none";
    body.style.justifyContent = active ? "flex" : "unset";
}

function setHeaderActive(active) {
    const titleScreen = document.getElementById('header');
    titleScreen.style.display = active ? "flex" : "none";
}