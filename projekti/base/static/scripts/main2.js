function encryptData(data) {
    const secretKey = 'cabildotest';  // Use a stronger, secret key in production
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encrypted;
}

// Decrypt data when retrieving it from localStorage/sessionStorage
function decryptData(encryptedData) {
    const secretKey = 'cabildotest';
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData); // Parse back to original data
}


window.addEventListener('pageshow', function(event) {
    // Check if the page is being restored from the cache
    if (event.persisted) {
        // Force a hard reload to refresh localStorage values and page state
        window.location.href = window.location.href;
        localStorage.setItem('numPersons', "");
        localStorage.setItem("selectedDate", "");
        localStorage.setItem("selectedDay", "");
    }
    
    // Option 2: Check if it's the first time visiting or navigating back
    if (!sessionStorage.getItem('page-visited')) {
        // First visit logic (set a flag in sessionStorage)
        sessionStorage.setItem('page-visited', 'true');
    } else {
        // Refresh sessionStorage when navigating back (clear it)
        sessionStorage.clear();
        sessionStorage.setItem('page-visited', 'true');  // Keep the flag for future checks
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

    // Loop through the current month days and render them
    for (let i = 1; i <= endDate; i++) {
        const currentDate = new Date(year, month, i);
        let classNames = [];

        // Get the openingspaces for the current day (i.e., day of month)
        const activityDate = currentDate.toDateString();  // Get the full date string
        let openingspaces = parseInt(localStorage.getItem(`openingspaces${activityDate}`)) || 0;  // Retrieve openingspaces


        // Add class if the day has no available spaces
        if (openingspaces < 1) {
            classNames.push('inactive');  // Add inactive class if no openingspaces
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
            // If the clicked day is inactive, do nothing
            if (this.classList.contains('inactive')) {
                return;  // Do nothing if the day is inactive
            }

            const day = parseInt(this.textContent, 10);
            const selectedDate = new Date(year, month, day);

            // Handle date selection logic
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
    
        // This function updates the places available as the input value changes
        function updatePlaces() {
            const inputValue = parseInt(numPersons.value) || 0;
            if (inputValue > openingspaces) {
                places.textContent = "Places left: 0";
            } else {
                places.textContent = "Places left: " + (openingspaces - inputValue);
            }
        }
    
        // This function removes places when the button is clicked
        function removePlaces() {
            const inputValue = parseInt(numPersons.value) || 0;
            if (inputValue <= 0) {
                alert("Please enter a valid number of persons.");
                return;
            }
            
            // Reduce openingspaces by the number of persons
            openingspaces -= inputValue;
    
            // Prevent negative spaces
            if (openingspaces < 0) {
                openingspaces = 0;
            }
    
            // Update localStorage and display the new number of places left
            sessionStorage.setItem(`openingspaces${newSelectedDate}`, openingspaces);
    
            // Update the displayed text with the updated openingspaces
            places.textContent = "Places left: " + openingspaces;
    
            // Reset the input field
            numPersons.value = "";
        }
    
        // Initial update of places available
        places.textContent = "Places left: " + openingspaces;
    
        // Remove previous event listeners if any
        numPersons.removeEventListener("input", updatePlaces);
        nextStepButton.removeEventListener("click", removePlaces);
    
        // Add event listeners
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


// SLIDE

let slideIndex = 0; // Start with the first slide

showSlides(); // Call the function to display the first slide

function showSlides() {
  let slides = document.getElementsByClassName("mySlides");

  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Increment slideIndex and reset if needed
  slideIndex++;
  if (slideIndex >= slides.length) { 
    slideIndex = 0; // Go back to the first slide
  }

  // Show the current slide
  slides[slideIndex].style.display = "block";

  // Automatically change slide every 4 seconds
  setTimeout(showSlides, 4000); // Recursive call to showSlides
}

const resetbtn = document.getElementById("resetbtn");
const numPersonsInput = document.getElementById('num-persons');
const nextStepButton = document.getElementById('next-step');
resetbtn.onclick = function(){
    window.location.reload();
}