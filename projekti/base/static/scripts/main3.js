
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.href = window.location.href;
        localStorage.setItem('numPersons', "");
        localStorage.setItem("selectedDate", "");
        localStorage.setItem("selectedDay", "");
    }
    
    if (!sessionStorage.getItem('page-visited')) {
        sessionStorage.setItem('page-visited', 'true');
    } else {
        sessionStorage.clear();
        sessionStorage.setItem('page-visited', 'true');  
    }
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

function renderCalendar() {
    const start = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    const end = new Date(year, month, endDate).getDay();
    const endDatePrev = new Date(year, month, 0).getDate();

    const today = new Date();
    const dayOfWeek = today.getDay();

    const currentWeekStart = new Date(today);
    const currentWeekEnd = new Date(today);

    if (dayOfWeek === 0) { 
        currentWeekStart.setDate(today.getDate() - 1);
        currentWeekEnd.setDate(today.getDate());
    } else if (dayOfWeek === 1) { 
        currentWeekStart.setDate(today.getDate() - 1);
        currentWeekEnd.setDate(today.getDate() + 6);
    } else { 
        currentWeekStart.setDate(today.getDate() - 1);
        currentWeekEnd.setDate(today.getDate() + (7 - dayOfWeek));
    }

    let datesHtml = "";

    for (let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    for (let i = 1; i <= endDate; i++) {
        const currentDate = new Date(year, month, i);
        let classNames = [];

        const activityDate = currentDate.toDateString(); 
        let openingspaces = parseInt(localStorage.getItem(`openingspaces${activityDate}`)) || 0;
        
        if (openingspaces < 1) {
            classNames.push('inactive');  
        }

        if (currentDate >= currentWeekStart && currentDate <= currentWeekEnd) {
            classNames.push('active-week');
        }

        if (currentDate.getTime() === today.getTime()) {
            classNames.push('today');
        }

        datesHtml += `<li class="${classNames.join(' ')}">${i}</li>`;
    }

    for (let i = end; i < 6; i++) {
        datesHtml += `<li class="inactive">${i - end + 1}</li>`;
    }

    dates.innerHTML = datesHtml;
    header.textContent = `${months[month]} ${year}`;

    addActiveWeekClickListeners();
}


navs.forEach((nav) => {
    nav.addEventListener("click", (e) => {
        const btnId = e.target.id;

        if (btnId === "prev") {
            if (month === 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
        } else if (btnId === "next") {
            if (month === 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
        }

        renderCalendar();
    });
});

let previouslySelectedDate = null;

function addActiveWeekClickListeners() {
    const activeWeekElements = document.querySelectorAll('.active-week');
    const selectionSection = document.getElementById('selection');
    const numPersonsInput = document.getElementById('num-persons');
    const nextStepButton = document.getElementById('next-step');
    const submitbtn = document.getElementById("submit");

    activeWeekElements.forEach(element => {
        element.addEventListener('click', function() {
            if (this.classList.contains('inactive')) {
                return;  
            }

            const day = parseInt(this.textContent, 10);
            const selectedDate = new Date(year, month, day);

            if (this.classList.contains('selected-date')) {
                clearSelectedDate();
                selectionSection.style.display = 'none';
                localStorage.removeItem('activityDate');
                window.location.reload(); 
            } else {
                if (previouslySelectedDate && previouslySelectedDate.getTime() !== selectedDate.getTime()) {
                    clearSelectedDate();
                    localStorage.removeItem('activityDate');
                    selectionSection.style.display = 'none';
                    window.location.reload();
                    return;
                }

                clearSelectedDate();
                this.classList.add('selected-date');
                selectionSection.style.display = 'flex';
                numPersonsInput.focus();
                localStorage.setItem('activityDate', selectedDate.toDateString());
                sessionStorage.setItem("activityDate", selectedDate.toDateString());
                SetSpaces()
                handlePlaces(day); 
                previouslySelectedDate = selectedDate;
            }
        });
    });
    function SetSpaces(){
        const newSelectedDate=localStorage.getItem("activityDate");
        for (let i = 0; i < 31; i++) {
            if (sessionStorage.getItem(`openingspaces${newSelectedDate}`) === null) {
                sessionStorage.setItem(`openingspaces${newSelectedDate}`, localStorage.getItem(`openingspaces${newSelectedDate}`) || 90);
            }
    }

    };
    function handlePlaces() {
        const places = document.getElementById("places");
        const numPersons = document.getElementById("num-persons");
        const nextStepButton = document.getElementById("next-step");
        const newSelectedDate = sessionStorage.getItem("activityDate");
        let openingspaces = parseInt(sessionStorage.getItem(`openingspaces${newSelectedDate}`));
    
        function updatePlaces() {
            const inputValue = parseInt(numPersons.value) || 0;
            if (inputValue > openingspaces) {
                places.textContent = "Places left: 0";
            } else {
                places.textContent = "Places left: " + (openingspaces - inputValue);
            }
        }
    
        function removePlaces() {
            const inputValue = parseInt(numPersons.value) || 0;
            if (inputValue <= 0) {
                alert("Please enter a valid number of persons.");
                return;
            }
            
            openingspaces -= inputValue;
    
            if (openingspaces < 0) {
                openingspaces = 0;
            }
    
            sessionStorage.setItem(`openingspaces${newSelectedDate}`, openingspaces);
    
            places.textContent = "Places left: " + openingspaces;
    
            numPersons.value = "";
        }
    
        places.textContent = "Places left: " + openingspaces;
    
        numPersons.removeEventListener("input", updatePlaces);
        nextStepButton.removeEventListener("click", removePlaces);
    
        numPersons.addEventListener("input", updatePlaces);
        nextStepButton.addEventListener("click", removePlaces);
    }

    function clearSelectedDate() {
        const activeWeekElements = document.querySelectorAll('.active-week');
        activeWeekElements.forEach(el => {
            el.classList.remove('selected-date');
        });
    }

    numPersonsInput.addEventListener('input', function() {
        let thisdate = localStorage.getItem("activityDate"); 
        let openingspaces = parseInt(localStorage.getItem(`openingspaces${thisdate}`)); 

        if (numPersonsInput.value > openingspaces) {
            numPersonsInput.value = openingspaces;
        }

        if (numPersonsInput.value > 15) {
            numPersonsInput.value = 15;
        }

        if (openingspaces < 1) {
            nextStepButton.classList.add('inactive'); 
            nextStepButton.disabled = true;
            classNames.push('inactive');  // Add inactive class if no openingspaces

        } else {
            nextStepButton.classList.remove('inactive');  
            nextStepButton.disabled = numPersonsInput.value < 1 || /^0\d/.test(numPersonsInput.value);
        }
    });

    nextStepButton.addEventListener('click', function() {
        if (numPersonsInput.value < 1) {
            numPersonsInput.classList.add('input-error');
            numPersonsInput.focus();
            return;
        }

        sessionStorage.setItem('numPersons', numPersonsInput.value);
        window.location.href = '/reserva/';
    });
}

renderCalendar();


let slideIndex = 0; 

showSlides(); 

function showSlides() {
  let slides = document.getElementsByClassName("mySlides");

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex >= slides.length) { 
    slideIndex = 0;
  }

  slides[slideIndex].style.display = "block";

  setTimeout(showSlides, 4000); 
}

const resetbtn = document.getElementById("resetbtn");
const numPersonsInput = document.getElementById('num-persons');
const nextStepButton = document.getElementById('next-step');
resetbtn.onclick = function(){
    window.location.reload();
}