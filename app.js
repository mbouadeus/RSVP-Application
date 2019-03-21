document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registrar");
    const input = form.querySelector("input");
    const mainDiv = document.querySelector(".main");
    const listUl = document.getElementById("invitedList");

    const div = document.createElement("div");
    const filterLabel = document.createElement("label");
    const filterCheckbox = document.createElement("input");

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //Needed for front-end resource fetching
    fetch(proxyUrl + 'https://api.darksky.net/forecast/ea83b01a9015852bafee77acaaabde5f/37.8267,-122.4233')
        .then(response => response.json())
        .then(parsedJSON => console.log(parsedJSON))
        .catch(error => console.log('parsing failed', error));

    filterLabel.textContent = "Hide those who haven't responded";
    filterCheckbox.type = "checkbox";
    div.appendChild(filterLabel);
    div.appendChild(filterCheckbox);
    mainDiv.insertBefore(div, listUl);

    filterCheckbox.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        const liList = listUl.children;
        
        if (isChecked) {
            for (let i = 0; i < liList.length; i++) {
                let li = liList[i];
                console.log(li.style.display);
                if (!li.className === "responded") {
                    li.style.display = "";
                } else {
                    li.style.display = "none";
                }
            }
        } else {
            for (let i = 0; i < liList.length; i++) {
                let li = liList[i];
                li.style.display = "";
            }
        }
    });

    function createLi(text) {
    
        const li = document.createElement("li");
        
        function createElement(elementName, property, value, parent) {
            const element = document.createElement(elementName);
            element[property] = value;
            appendToParent(element, parent);
            return element;
        }
        
        function appendToParent(element, parent) {
            parent.appendChild(element);
        }
        
        createElement("span", "textContent", text, li);

        const label = createElement("label", "textContent", "Confirmed", li);
        
        createElement("input", "type", "checkbox", label);
        
        createElement("button", "textContent", "edit", li);

        createElement("button", "textContent", "remove", li);

        return li;
    }
    form.addEventListener("submit", (e) => {
        const liList = listUl.children;
        
        let nameValidation = {
            empty: () => {
                alert("Please enter a valid name");
            },
            repeat: () => {
                for (let i = 0; i < liList.length; i++) {
                    if (input.value === liList[i].querySelector("span").textContent) {
                        alert("Name already in List");
                        return true;
                    }
                }
                return false;
            }
        };
        e.preventDefault();
        
        if (input.value === "") {
            nameValidation.empty();
        } else if (nameValidation.repeat()) {
            input.value = "";
        } else {
            const li = createLi(input.value);
            listUl.appendChild(li);
            input.value = "";
        }
    });

    listUl.addEventListener("change", (e) => {
       const checkbox = e.target;
       const checked = checkbox.checked;
       const li = checkbox.parentNode.parentNode;

       if (checked) {
           li.className = "responded";
       } else {
           li.className = "";
       }
    });

    listUl.addEventListener("click", (e) => {
        
        if (e.target.tagName === "BUTTON") {
            let button = e.target;
            const li = button.parentNode;
            const action = button.textContent;
    
            const nameAction = {
                remove: () => {
                    listUl.removeChild(li);
                },
                edit: () => {
                    const li = button.parentNode;
                    const span = li.firstElementChild;
                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = span.textContent;
                    li.insertBefore(input, span);
                    li.removeChild(span);
                    button.textContent = "save";
                },
                save: () => {
                    const li = button.parentNode;
                    const input = li.firstElementChild;
                    const span = document.createElement("span");
                    span.textContent = input.value;
                    li.insertBefore(span, input);
                    li.removeChild(input);
                    button.textContent = "edit";
                }
            };
            // Select and run action in button's name
            nameAction[action]();
        }
    });
});