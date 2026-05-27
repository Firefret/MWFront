import {newEndeavor} from "./requests.js";

function newEndeavorItem(itemName:string): HTMLDivElement{
    let item = document.createElement("div");
    item.className = "endeavor-item";

    // amount
    let amount = document.createElement("input");
    amount.type = "number";
    amount.min = "0";
    amount.value = "1";
    amount.oninput = (evt) => {
        let tar = evt.currentTarget as HTMLInputElement;
        tar.value = (!!tar.value && Math.abs(parseInt(tar.value)) >= 0 ? Math.abs(parseInt(tar.value)) : 0).toString();
    }
    amount.className = "item-amount";

    // --- NEW: ICON WRAPPER WITH HQ OVERLAY ---
    let iconWrapper = document.createElement("div");
    iconWrapper.className = "icon-wrapper";

    let itemIcon = document.createElement("img");
    itemIcon.className = "item-icon";
    itemIcon.src = "https://www.garlandtools.org/files/icons/item/7.png";
    itemIcon.width = 64;
    itemIcon.height = 64;

// In your newEndeavorItem function, look for your overlay layout definition:
    let hqOverlay = document.createElement("img");
    hqOverlay.className = "hq-overlay"; // No more '.hidden' class by default
    hqOverlay.src = "https://www.garlandtools.org/db/images/item/HQOverlay.png";
    hqOverlay.width = 64;
    hqOverlay.height = 64;

    iconWrapper.append(itemIcon, hqOverlay);

    // Update the event trigger to toggle the '.active' state class:

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

    // --- NEW: HQ REAL-TIME EVENT TOGGLE ---
    qualityToggleInput.onchange = (evt) => {
        let checkbox = evt.currentTarget as HTMLInputElement;
        if (checkbox.checked) {
            hqOverlay.classList.add("active"); // Fades in smoothly
        } else {
            hqOverlay.classList.remove("active"); // Fades out smoothly
        }
    };
    // --------------------------------------

    // info block
    let itemInfo = document.createElement("div");
    itemInfo.className = "item-info";
    itemInfo.append(itemNameText);
    itemInfo.append(qualityToggle);

    // Append the container wrapper instead of just the lone raw icon img
    item.append(iconWrapper, itemInfo, amount);
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

function addItemHandler(evt: MouseEvent){
    let button = evt.currentTarget as HTMLButtonElement;
    let itemSearch = document.getElementById("item-search") as HTMLInputElement;
    let itemName = itemSearch.value;
    if (itemName == "") return;
    let item = newEndeavorItem(itemName);
    let buttonParent = button.parentElement as HTMLElement;
    let requestElement = buttonParent.parentElement as HTMLElement;
    let endeavorElement = document.querySelector("#endeavor") as HTMLElement;
    if (!endeavorElement){
        endeavorElement = document.createElement("div");
        endeavorElement.id = "endeavor";
        let container = document.getElementById("global-container") as HTMLElement;
        container.append(endeavorElement);
    }
    let itemList = Array.from(endeavorElement.children).filter(child => child.className == "endeavor-item") as HTMLInputElement[];
    item.id = "item-" + itemList.length;


    endeavorElement.append(item)
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
    let fieldsParent = itemsElement.parentElement as HTMLElement;
    let buttons = document.getElementById("item-buttons") as HTMLElement;
    let deleteItemButton = buttons.querySelector("#remove-item") as HTMLButtonElement;
    let submitRequestButton = buttons.querySelector("#submit-request") as HTMLButtonElement;
    if (submitRequestButton != null && deleteItemButton != null){
        buttonsPresent = true;
    }
    console.log(buttonsPresent)
    if (items.length > 0 && !buttonsPresent){
        let deleteItemButton = document.createElement("button");
        deleteItemButton.innerText = "Remove Item";
        deleteItemButton.id = "remove-item";
        deleteItemButton.addEventListener("click", removeItemHandler);
        let submitRequestButton = document.createElement("button");
        submitRequestButton.innerText = "Submit";
        submitRequestButton.id = "submit-request";
        submitRequestButton.addEventListener("click", submitHandler);
        buttons.append(deleteItemButton, submitRequestButton);
    }
    if (items.length == 0 && buttonsPresent){
        if (deleteItemButton){
            deleteItemButton.removeEventListener("click", removeItemHandler);
            deleteItemButton.remove();
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
    try {
        let buttons = document.getElementById("item-buttons") as HTMLElement;
        // ==========================================
        // 1. PHASE ONE: START LOADING
        // ==========================================
        button.disabled = true; // Prevent double-clicking while waiting
        button.innerText = "Fetching...";

        // Optional: Show a hidden spinner element on your overlay
        // let spinner = document.getElementById("loading-spinner");
        // spinner.classList.remove("hidden");

        // ==========================================
        // 2. PHASE TWO: THE WAIT
        // ==========================================
        // The browser freezes right here, showing the loading text/disabled button
        let endeavor = await newEndeavor(itemList, worldName)
        console.log(endeavor);

        // Render your ordeal list UI here using the 'endeavor' payload

    } catch (error) {
        console.error("Endeavor failed:", error);
        alert("Something went wrong calculating market values.");
    } finally {
        // ==========================================
        // 3. PHASE THREE: CLEANUP / STOP LOADING
        // ==========================================
        // The 'finally' block ALWAYS runs whether the request succeeded or crashed
        button.disabled = false;
        button.innerText = "Calculate Profit";

        // let spinner = document.getElementById("loading-spinner");
        // spinner.classList.add("hidden");
    }
}




let addItemButton = document.getElementById("add-item") as HTMLButtonElement;
addItemButton.addEventListener("click", addItemHandler)
let itemDatalist = document.getElementById("items") as HTMLInputElement;
itemTestAutofill(itemDatalist);