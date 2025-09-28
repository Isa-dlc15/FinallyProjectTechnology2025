let events = [];    //Almacena los eventos
let arr = [];       //Almacena los datos

    const eventName = document.querySelector('#EventName');
    const eventDate = document.querySelector('#EventDate');
    const buttonAdd = document.querySelector('#bAdd');
    const eventsContainer = document.querySelector('#eventsContainer');

const json = load();

//Guarda los datos

try {
    arr = JSON.parse(json);
} catch (error){
    arr = [];
};
events = arr ? [... arr] : [];

renderEvents();

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addEvent();
});

//Si no ahi informacion, no hace nada

function addEvent(){
    if(eventName.value === '' || eventDate.value === ""){
        return;
    }

//Si la fecha ya paso, no hace nada 

    if(dateDiff(eventDate.value) < 0){
        return;
    }

//Determina los dias

    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3),
        name: eventName.value,
        date: eventDate.value,
    };

    events.unshift(newEvent);

    save(JSON.stringify(events));

    eventName.value = "";

    renderEvents();
};

//Cuenta regresiva (funcionalidad)

function dateDiff(d){
    const targetDate = new Date(d);
    const today = new Date();
    const difference = targetDate.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
};

//Nombre de evento, Fecha del evento, dias restantes y boton para eliminar JS

function renderEvents(){
    const eventsHTML = events.map(event => {
        return `
            <div class="event">
                <div class ="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-test">dias</span>
                </div>

                <div class="event-name" id="${event.id+"name"}">${event.name}</div>
                <div class="event-date" id="${event.id+"date"}">${event.date}</div>
                <div class="actions">
                    <button class="bActualizar" data-id="${
                        event.id
                    }">Modificar <i class="bi bi-arrow-clockwise"></i> </button>
                    <button class="bDelete" data-id="${
                        event.id
                    }">Eliminar <i class="bi bi-trash-fill"></i> </button>
                `;

//btn eliminar     

            });
    eventsContainer.innerHTML = eventsHTML.join("");
    document.querySelectorAll(".bDelete").forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = button.getAttribute("data-id");
            events = events.filter((event) => event.id != id);
           
            renderEvents();
        });
    });    

//btn actualizar/eliminar

eventsContainer.innerHTML = eventsHTML.join("");
    document.querySelectorAll(".bDelete").forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = button.getAttribute("data-id");6
            events = events.filter((event) => event.id != id);
           
            renderEvents();
        });
    });

    //btn actualizar/restaurar

    document.querySelectorAll(".bActualizar").forEach((button) => {
    button.addEventListener("click", () => {
        
        console.log(button)
        var id1 = button.getAttribute("data-id")
        console.log("ID = "+id1+".")
        var idname = id1+"name"
        console.log(idname)
        var name = document.getElementById(idname).textContent
        console.log(name)
        var iddate = id1+"date"
        
        var date = document.getElementById(iddate).textContent
        console.log(date)
        eventName.value = name
        eventDate.value = date
        const id = button.getAttribute("data-id");  
        events = events.filter((event) => event.id != id);
       
        renderEvents();
    });
});
};
function save(data){
    localStorage.setItem('items', data);
};

function load(){
    return localStorage.getItem('items');
};