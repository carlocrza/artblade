const openGalleryButton = document.getElementById("open-gallery-button");
const modal = document.getElementById("modal");
const modalContentContainer = document.getElementById("modal-content-container");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const modalLeft = document.getElementById("modal-left");
const modalRight = document.getElementById("modal-right");
const imageList = document.getElementById("imageList");
const modalExit = document.getElementById("modal-exit");
const zoomInput = document.getElementById("zoom-input");
let currentImage = 0;
let modalOpen = false;
let prevActiveElem = undefined;

const gridContainer = document.querySelector(".grid-container");


/* || Create the grid of images */
images.forEach((img, i ) => {
    if (img.url === undefined) return;

    const a = document.createElement("a");
    a.classList.add("grid-item");
    a.style.backgroundImage = "url(" + imagePath + img.url + ")";

    if (img.caption_title || img.caption) {
        const div = document.createElement("div");
        div.classList.add("grid-item-caption");
        a.appendChild(div);

        if (img.caption_title) {
            const h2 = document.createElement("h2");
            let title = img.caption_title;
            if (title.length > 30) {
                title = title.substring(0, 20) + "...";
            }
            h2.textContent = title;
            div.appendChild(h2);
        }
    
        if (img.caption) {
            const p = document.createElement("p");
            let caption = img.caption;
            if (caption.length > 68) {
                caption = caption.substring(0, 68) + "...";
            }
            p.textContent = caption;
            div.appendChild(p);
        }
    }

    a.onclick = e => open(e, i);

    gridContainer.appendChild(a);
});


/* || Modal functionality */

function open(e, index) {
    // save what element opened the modal so can return tab focus to there
    if (modalOpen === false) {
        modalOpen = true;
        prevActiveElem = document.activeElement;
    }

    modal.style.display = "flex";
    /* focus lets us tab. note needed to add tabindex="0" to modal overlay for this to work */
    modal.focus();
    changeModalImage(index);
}

function changeModalImage(index) {
    if (index !== undefined) {
        currentImage = index;
    }
    const img = images[currentImage];
    setModalImageZoom(1);
    zoomInput.value = 0;
    modalImage.src = imagePath + img.url;
    if (img.caption || img.caption_title) {
        modalCaption.style.display = "block";
        const h2 = modalCaption.querySelector("h2");
        const p = modalCaption.querySelector("p");
        h2.textContent = "";
        p.textContent = "";
        if (img.caption_title) {
            h2.textContent = img.caption_title;
        }
        if (img.caption) {
            p.textContent = img.caption;
        }
    } else {
        modalCaption.style.display = "none";
    }
}

function exit(e) {
    modal.style.display = "none";
    modalOpen = false;
    if (document.body.contains(prevActiveElem)) {
        prevActiveElem.focus();
    }
}

function goLeft(e) {
    e.stopPropagation();
    currentImage = subByOne(currentImage);
    changeModalImage();
}

function goRight(e) {
    e.stopPropagation();
    currentImage = addByOne(currentImage);
    changeModalImage();
}

function addByOne(num) {
    return (num + 1) % images.length;
}

function subByOne(num) {
    return ((num - 1) + images.length) % images.length;
}

/* don't exit when click modal content (img / caption) */
modalContentContainer.onclick = function(e) {
    e.stopPropagation();
}

/* on page load get first image in modal */
changeModalImage(0);

modalLeft.onclick = goLeft;
modalRight.onclick = goRight;
openGalleryButton.onclick = (e) => open(e, 0);
modal.onclick = exit;
modalExit.onclick = exit;

modal.addEventListener("keyup", function(e) {
    switch (e.key) {
        case "ArrowLeft":
            goLeft(e);
            break;
        case "ArrowRight":
            goRight(e);
            break;
        case "Escape":
            exit();
            break;
    }
});




/* || Zoom */

/* stop left/right arrows from navigating images instead of controlling input */
zoomInput.addEventListener("keyup", function(e) {
    e.stopPropagation();
});

zoomInput.oninput = onZoomInput;

function onZoomInput(e) {
    const zoom = parseInt(zoomInput.value);

    setModalImageZoom(1 + zoom/10);
}

function setModalImageZoom(num) {
    modalImage.style.transform = "scale(" + num + ")";
}

const zoomMinus = document.getElementById("zoom-minus");
const zoomPlus = document.getElementById("zoom-plus");

let mouseIsDown = true;
function zoomOut() {
    zoomInput.value = String(parseInt(zoomInput.value) - 2);
    onZoomInput();
}

function zoomIn() {
    zoomInput.value = String(parseInt(zoomInput.value) + 2);
    onZoomInput();
}

zoomMinus.addEventListener("mousedown", (e) => {
    mouseIsDown = true;

    zoomOut();
    const timer = setInterval(function() {
        if(mouseIsDown === false) {
            clearInterval(timer)
        } else {
            zoomOut();
        }
    }, 100);
});

zoomMinus.addEventListener("mouseup", (e) => {
    mouseIsDown = false;
});

zoomPlus.addEventListener("mousedown", (e) => {
    mouseIsDown = true;

    zoomIn();
    const timer = setInterval(function() {
        if(mouseIsDown === false) {
            clearInterval(timer)
        } else {
            zoomIn();
        }
    }, 100);
});

zoomPlus.addEventListener("mouseup", (e) => {
    mouseIsDown = false;
});



/* || Styling, accessibility, other */

/* make all `a` tags are selectable, tabbable even if no href set 
   note: overwrites css pointer
*/
document.querySelectorAll("a").forEach(elem => {
    if (!elem.hasAttribute("tabindex"))
        elem.setAttribute("tabindex", 0);
    elem.style.cursor = "pointer";
    elem.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            elem.onclick(e);
        }
    });
});

/* on last elem (exit) make tab go back to beginning of modal instead of background */
modalExit.addEventListener("keydown", function(e) {
    switch (e.key) {
        case "Tab":
            modal.focus();
            break;
    }
});