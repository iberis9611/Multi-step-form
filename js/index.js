const multiStepForm = document.querySelector("[data-multi-step]");
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
const nextBtns = [...multiStepForm.querySelectorAll("[data-next]")];
const prevBtns = [...multiStepForm.querySelectorAll("[data-previous]")];
const allInputs = [...multiStepForm.querySelectorAll('input')].slice(0,3);
const stepCircles = [...document.querySelectorAll(".aside__span")];
const roundBtn = document.querySelector(".subscription__span");
const btnHolder = document.querySelector(".subscription__button");
const subscriptions = [...document.querySelectorAll("[data-subscription]")];
const plansInfo = [...document.querySelectorAll(".plan__figcaption")] ;
const plansPrice = [...document.querySelectorAll(".plan__p")];
const plans = [...document.querySelectorAll("[data-plan]")];
const addonsPrice = [...document.querySelectorAll("[data-addon-price]")];
const addons = [...document.querySelectorAll(".addon__item")];
const selectedPlanName = document.querySelector(".summary__plan__name");
const selectedPlanDurarion = document.querySelector(".summary__plan__duration");
const selectedPlanPrice = document.querySelector("#planPrice")
const changePlanBtn = document.querySelector("[data-change]");
const durationTotal = document.querySelector(".total__duration");
const summaryAddons = [...document.querySelectorAll(".summary__addons__item")];
const summaryAddonContainer = document.querySelector(".summary__addons");
const priceTotal = document.querySelector("#total");
const summaryAddonsPrice = [...summaryAddonContainer.querySelectorAll(".marineBlue")];
const confirmBtn = document.querySelector("[data-confirm]");

// Return the index of step. starting from 0. Return -1 if there is no element.
let currentStep = formSteps.findIndex((step, index) => {
    return step.classList.contains("active");
})
let currentSubscription = subscriptions.findIndex((sub, index) => {
    return sub.classList.contains("subscribed");
})
// plansInfo click event
let currentPlan = plans.findIndex((plan, index) => {
    return plan.classList.contains("selected");
})

// Add class "active" to the first step if there if no current step.
if (currentStep < 0) {
    currentStep = 0;
    formSteps[currentStep].classList.add("active");
    stepCircles[currentStep].classList.add("highlight");
}

if (currentSubscription < 0) {
    currentSubscription = 0;
    subscriptions[currentSubscription].classList.add("subscribed");
    btnHolder.classList.add("moved");
}

if (currentPlan < 0) {
    currentPlan = 0;
    plans[currentPlan].classList.add("selected");
}

// Update the input fields layout from time to time depending on the input content.
allInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
        if (e.target.value !== '') {
            const prevEleSib = input.previousElementSibling;
            if (prevEleSib.childElementCount > 1) {
                // Remove the error message
                prevEleSib.childNodes[1].remove();
            }
            input.style.borderColor = '#1D84B5';
        } else {
            promptError(input);
        }
    });
});

// Click 'Next Step' Button
nextBtns.forEach((btn, index) => {
    btn.addEventListener("click", e => {
        // Show error message when the input has only whitespace or is not valid.
        const inputs = [...formSteps[currentStep].querySelectorAll("input")];
        inputs.forEach(input => {
            if (input.value.trim() === '' || !input.checkValidity()) {
                promptError(input);
            }
        })
        // Move to the next step only if all the input fields are valid.
        const allValid = inputs.every(input => input.checkValidity());
        if (allValid) {
            currentStep += 1;
            showCurrentStep();
        }
        // Calculate the total price upon clicking on the last 'next step' button
        if (index === 2) {
            let total;
            const regex= /(\d+)/;

            total = parseInt(selectedPlanPrice.textContent.match(regex)[0]);
            summaryAddonsPrice.forEach(price => {
                if (!price.parentElement.classList.contains("offscreen")) {
                    total += parseInt(price.textContent.match(regex)[0]);
                }
            })

            if (currentSubscription === 0) {
                priceTotal.textContent = `+$${total}/mo`;
            } else {
                priceTotal.textContent = `+$${total}/yr`;
            }
        }
    })
})

// Click 'Previous Step' Button
prevBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        currentStep -= 1;
        showCurrentStep();
    })
})

// Switch between Monthly and Yearly subscriptions
roundBtn.addEventListener("click", e => {
    btnHolder.classList.toggle("moved");
    if (currentSubscription === 0) {
        currentSubscription +=1
        // Update text content of the plan price
        plansPrice[0].textContent = "$90/yr";
        plansPrice[1].textContent = "$120/yr";
        plansPrice[2].textContent = "$150/yr";
        // Append p element of '2 months free'
        plansInfo.forEach(info => {
            const discount = document.createElement("p");
            discount.style.fontSize = 0.75 + "rem";
            discount.style.color = "hsl(213, 96%, 18%)";
            const discountText = document.createTextNode("2 months free");
            discount.appendChild(discountText);
            info.appendChild(discount)
        })
        // Update text content of the add-ons' price
        addonsPrice[0].textContent = "+$10/yr";
        addonsPrice[1].textContent = "+$20/yr";
        addonsPrice[2].textContent = "+$20/yr";
        // Update plan duration on the finish-up page
        selectedPlanDurarion.textContent = "Yearly";
        durationTotal.textContent = "Year";
        // Update add-ons' price on the finish-up page
        summaryAddonsPrice[0].textContent = "+$10/yr";
        summaryAddonsPrice[1].textContent = "+$20/yr";
        summaryAddonsPrice[2].textContent = "+$20/yr";
    } else if (currentSubscription === 1) {
        currentSubscription -= 1
        // change text content of the plan price
        plansPrice[0].textContent = "$9/mo";
        plansPrice[1].textContent = "$12/mo";
        plansPrice[2].textContent = "$15/mo";
        // Remove the p elements of '2 months free'
        plansInfo.forEach(info => {
            info.childNodes[5].remove()
        })
        // Update text content of the add-ons' price
        addonsPrice[0].textContent = "+$1/mo";
        addonsPrice[1].textContent = "+$2/mo";
        addonsPrice[2].textContent = "+$2/mo";
        // Update plan duration on the finish-up page
        selectedPlanDurarion.textContent = "Monthly";
        durationTotal.textContent = "Month";
        // Update add-ons' price on the finish-up page
        summaryAddonsPrice[0].textContent = "+$1/mo";
        summaryAddonsPrice[1].textContent = "+$2/mo";
        summaryAddonsPrice[2].textContent = "+$2/mo";
    }

    subscriptions.forEach((sub, index) => {
        sub.classList.toggle("subscribed", index === currentSubscription);
    })

    // Update the plan price in the finishing-up page
    selectedPlanPrice.textContent = plans[currentPlan].querySelector("p").textContent;
})

// Switch between different plans
plans.forEach((plan, index) => {
    plan.addEventListener("click", e => {
        if (currentPlan !== index) {
            // remove the style from the previously-selected plan
            plans[currentPlan].classList.remove("selected");
            // add style to the selected plan
            currentPlan = index;
            plan.classList.add("selected");
            // Change the plan info in the finishing-up page
            selectedPlanName.textContent = plan.querySelector("h3").textContent;
            selectedPlanPrice.textContent = plan.querySelector("p").textContent;
        }
    })
})

// Update add-ons' style and the add-ons content on the finishing up page
addons.forEach((addon, index) => {
    addon.addEventListener("click", e => {
        const isChecked = addon.querySelector(".addon__input").checked;
        // Toggle the style of add-ons on the pick-add-ons page
        addon.classList.toggle("picked", isChecked);
        // Toggle the displayed addons on the finish-up page
        summaryAddons[index].classList.toggle("offscreen", !isChecked);
    })
})

// Show step 5/ thank-you page upon clicking the confirm button
confirmBtn.addEventListener("click", e => {
    currentStep += 1;
    showCurrentStep();
})

// Back to 'Selct your plan' page upon clicking the 'Change' button on the 'Finishing up' page
changePlanBtn.addEventListener("click", e => {
    currentStep = 1;
    showCurrentStep();
})

// Show card if its data-step is the same as the currentStep.
const showCurrentStep = () => {
    // Display the page that has "active" class.
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    })
    // Display current page's corresponding circle in the header.
    stepCircles.forEach((circle, index) => {
        // If it's the final step, don't toggle
        if (currentStep < 4) {
            circle.classList.toggle("highlight", index === currentStep)
        }
    })
};

// Append an error message to the right of label
const promptError = (element) => {
    const prevEleSib = element.previousElementSibling;
    if (prevEleSib.childElementCount === 1) {
        const errorMsg = document.createElement('span');
        errorMsg.style.color = 'hsl(354, 84%, 57%)';

        let message;
        if (element.value.trim() === '') {
            message = 'This field is required';
        } else if (!element.checkValidity()) {
            message = `Wrong ${element.name} format`
        }

        const pText = document.createTextNode(message);
        errorMsg.appendChild(pText);
        prevEleSib.appendChild(errorMsg);
        element.style.borderColor = 'hsl(354, 84%, 57%)';
    }
};