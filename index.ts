import {newEndeavor} from "./requests.js";

function newEndeavorItem(itemName:string): HTMLDivElement{
    let item = document.createElement("div");
    item.className = "endeavor-item";

    // amount
    let amountWrapper = document.createElement("div");
    amountWrapper.className = "amount-wrapper";

    let minusBtn = document.createElement("div");
    minusBtn.className = "amount-btn minus";
    minusBtn.innerText = "−"; // Unicode minus sign look crisp

    let amount = document.createElement("input");
    amount.type = "number";
    amount.min = "0";
    amount.value = "1";
    amount.className = "item-amount";

    // Maintain your existing absolute cleanup logic on direct input entry
    amount.oninput = (evt) => {
        let tar = evt.currentTarget as HTMLInputElement;
        tar.value = (!!tar.value && Math.abs(parseInt(tar.value)) >= 0 ? Math.abs(parseInt(tar.value)) : 0).toString();
    }

    let plusBtn = document.createElement("div");
    plusBtn.className = "amount-btn plus";
    plusBtn.innerText = "+";

    // Wire up the Minus Hook
    minusBtn.onclick = () => {
        let currentVal = parseInt(amount.value) || 0;
        let minVal = parseInt(amount.min) || 0;
        if (currentVal > minVal) {
            amount.value = (currentVal - 1).toString();
            // Trigger the oninput hook manually if other logic tracks edits live
            amount.dispatchEvent(new Event('input'));
        }
    };

    // Wire up the Plus Hook
    plusBtn.onclick = () => {
        let currentVal = parseInt(amount.value) || 0;
        amount.value = (currentVal + 1).toString();
        amount.dispatchEvent(new Event('input'));
    };

    // Stitch the stepper sequence together horizontally
    amountWrapper.append(minusBtn, amount, plusBtn);
    // ----------------------------------------------------;

    // icon with hq overlay
    let iconWrapper = document.createElement("div");
    iconWrapper.className = "icon-wrapper";
    let itemIcon = document.createElement("img");
    itemIcon.className = "item-icon";
    itemIcon.src = "https://www.garlandtools.org/files/icons/item/7.png";
    let hqOverlay = document.createElement("img");
    hqOverlay.className = "hq-overlay";
    hqOverlay.src = "https://www.garlandtools.org/db/images/item/HQOverlay.png";
    iconWrapper.append(itemIcon, hqOverlay);

    // name
    let itemNameText = document.createElement("span");
    itemNameText.innerText = itemName;
    itemNameText.className = "item-name";

    // quality
    let qualityToggle = document.createElement("label");
    qualityToggle.className = "switch";
    let qualityToggleInput = document.createElement("input");
    qualityToggleInput.type = "checkbox";
    let qualitySlider = document.createElement("span");
    qualitySlider.className = "slider";
    qualityToggle.append(qualityToggleInput, qualitySlider);

    qualityToggleInput.onchange = (evt) => {
        let checkbox = evt.currentTarget as HTMLInputElement;
        if (checkbox.checked) {
            hqOverlay.classList.add("active"); // Fades in smoothly
        } else {
            hqOverlay.classList.remove("active"); // Fades out smoothly
        }
    };


    // info block
    let itemInfoWrapper = document.createElement("div");
    itemInfoWrapper.className = "item-info";
    itemInfoWrapper.append(itemNameText);
    itemInfoWrapper.append(qualityToggle);

    //delete button
    let deleteIcon = document.createElement("img");
    deleteIcon.className = "delete-button";
    deleteIcon.src = "remove.png";
    deleteIcon.width = 16;
    deleteIcon.height = 16;
    deleteIcon.onclick = () => {
        let endeavorElement = document.querySelector("#endeavor") as HTMLElement;
        item.remove();
        requestButtonsPresence(endeavorElement);
    }


    //right side wrapper
    let rightSideWrapper = document.createElement("div");
    rightSideWrapper.className = "right-side-wrapper";
    rightSideWrapper.append(deleteIcon, amountWrapper);


    item.append(iconWrapper, itemInfoWrapper, rightSideWrapper);
    return item;
}

function itemTestAutofill(datalist: HTMLInputElement){
    let testItems = [
        "Grade 2 Gemdraught of Intelligence",
        "Ra'Kaznar Ingot",
        "Courtly Lover's Sword"
    ]
    testItems.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.innerText = item;
        datalist.append(option)
    })
}

function isItemExists(itemName: string): HTMLSpanElement[]{
    let itemList = Array.from(document.querySelectorAll("#endeavor .item-name")) as HTMLSpanElement[];
    return itemList.filter(item => item.innerText == itemName) as HTMLSpanElement[];
}

function addItemHandler(evt: MouseEvent){
    let button = evt.currentTarget as HTMLButtonElement;
    let itemSearch = document.getElementById("item-search") as HTMLInputElement;
    let itemName = itemSearch.value;
    if (itemName == "") return;
    let buttonParent = button.parentElement as HTMLElement;
    let requestElement = buttonParent.parentElement as HTMLElement;
    let endeavorElement = document.querySelector("#endeavor") as HTMLElement;
    if (!endeavorElement) {
        endeavorElement = document.createElement("div");
        endeavorElement.id = "endeavor";
        let endeavorWrapper = document.createElement("div");
        endeavorWrapper.id = "endeavor-wrapper";
        endeavorWrapper.append(endeavorElement);
        let container = document.getElementById("global-container") as HTMLElement;
        container.append(endeavorWrapper);
    }
    let existingItem = isItemExists(itemName);
    if (isItemExists(itemName).length > 0){
        let nameElement = existingItem[0] as HTMLSpanElement;
        let itemDataWrapper = nameElement.parentElement as HTMLDivElement;
        let item = itemDataWrapper.parentElement as HTMLDivElement;
        let amount = item.querySelector(".item-amount") as HTMLInputElement;
        amount.value = (parseInt(amount.value) + 1).toString();
    }
    else{
        let itemList = Array.from(endeavorElement.children).filter(child => child.className == "endeavor-item") as HTMLInputElement[];
        let item = newEndeavorItem(itemName);
        item.id = "item-" + itemList.length;
        endeavorElement.append(item)
    }

    itemSearch.value = "";
    requestButtonsPresence(endeavorElement)
}

function removeItemHandler(evt: MouseEvent){
    let button = evt.currentTarget as HTMLButtonElement;
    let fieldsElement = document.getElementById("endeavor") as HTMLElement;
    let fields = fieldsElement.children;
    let lastField = fields[fields.length-1];
    if (lastField) lastField.remove();
    requestButtonsPresence(fieldsElement);

}

function requestButtonsPresence(itemsElement: HTMLElement){
    let children = itemsElement.children;
    let items = Array.from(children) as HTMLDivElement[];
    let buttonsPresent = false
    let endeavorElement = document.getElementById("endeavor") as HTMLElement;
    let buttons = document.getElementById("item-buttons") as HTMLElement;
    let submitRequestButton = buttons.querySelector("#submit-request") as HTMLButtonElement;
    if (submitRequestButton != null){
        buttonsPresent = true;
    }
    console.log(buttonsPresent)
    if (items.length > 0 && !buttonsPresent){
        let submitRequestButton = document.createElement("button");
        submitRequestButton.innerText = "Submit";
        submitRequestButton.id = "submit-request";
        submitRequestButton.addEventListener("click", submitHandler);
        buttons.append(submitRequestButton);
    }
    if (items.length == 0 && buttonsPresent){
        if (endeavorElement){
            endeavorElement.remove();
            let wrapper = document.getElementById("endeavor-wrapper") as HTMLElement;
            wrapper.remove();
        }
        if (submitRequestButton) {
            submitRequestButton.removeEventListener("click", submitHandler);
            submitRequestButton.remove();
        }

    }
}

function formItemList(): {name: string, amount: number}[]{
    let endeavorElement = document.getElementById("endeavor") as HTMLElement;
    let endeavorItems = Array.from(endeavorElement.children) as HTMLInputElement[];
    return endeavorItems.map(endItem => {
        let itemInfoElement = endItem.querySelector(".item-info") as HTMLDivElement
        let itemNameElement = itemInfoElement.querySelector(".item-name") as HTMLSpanElement;

        let itemQualityLabel = itemInfoElement.querySelector(".switch") as HTMLLabelElement;
        let itemQuality = itemQualityLabel.querySelector("input") as HTMLInputElement;


        let itemAmountElement = endItem.querySelector(".item-amount") as HTMLInputElement;
        return {
            name: itemNameElement.innerHTML,
            amount: parseInt(itemAmountElement.value),
            quality: itemQuality.checked
        };
    })
}

async function submitHandler(evt: MouseEvent){
    let itemList = formItemList()
    let button = evt.currentTarget as HTMLButtonElement;
    let worldElement = document.getElementById("world-name") as HTMLInputElement;
    let worldName = worldElement.value;
    console.log(worldName);
    console.log(itemList);
    let spinner = document.createElement("span");
    spinner.className = "loader";
    let endeavorElement = document.getElementById("endeavor") as HTMLElement;
    let endeavorWrapper = document.getElementById("endeavor-wrapper") as HTMLElement;
    try {
        button.disabled = true;
        button.innerText = "Fetching...";
        endeavorElement.classList.add("loading-blur");
        endeavorWrapper.prepend(spinner);

        let endeavor = await newEndeavor(itemList, worldName)
        console.log(endeavor);


    } catch (error) {
        console.error("Endeavor failed:", error);
        alert("Something went wrong calculating market values.");
    } finally {
        button.remove()
        endeavorElement.remove();
        spinner.remove();
        endeavorWrapper.remove()

    }
}




let addItemButton = document.getElementById("add-item") as HTMLButtonElement;
addItemButton.addEventListener("click", addItemHandler)
let itemDatalist = document.getElementById("items") as HTMLInputElement;
itemTestAutofill(itemDatalist);