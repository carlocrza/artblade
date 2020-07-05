const openGalleryButton = document.getElementById("open-gallery-button");
const modal = document.getElementById("modal");
const modalContentContainer = document.getElementById("modal-content-container");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const modalLeft = document.getElementById("modal-left");
const modalRight = document.getElementById("modal-right");
const imageList = document.getElementById("imageList");
const modalExit = document.getElementById("modal-exit");
let currentImage = 0;
let modalOpen = false;
let prevActiveElem = undefined;

const gridContainer = document.querySelector(".grid-container");

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

changeModalImage(0);

openGalleryButton.onclick = (e) => open(e, 0);
modal.onclick = exit;
modalExit.onclick = exit;

function open(e, index) {
    // save what element opened the modal so can return tab focus to there
    if (modalOpen === false) {
        modalOpen = true;
        prevActiveElem = document.activeElement;
    }

    modal.style.display = "flex";
    modal.focus();
    changeModalImage(index);
}

function changeModalImage(index) {
    if (index !== undefined) {
        currentImage = index;
    }
    const img = images[currentImage];
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

modalContentContainer.onclick = function(e) {
    e.stopPropagation();
}

let scale = 1;

modalImage.onclick = function(e) {
    e.stopPropagation();
    scale += .2;
    modalImage.style.transform = "scale(" + scale + ")";
}

modalLeft.onclick = goLeft;
modalRight.onclick = goRight;
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

modalExit.addEventListener("keydown", function(e) {
    console.log("here" + e.key);
    switch (e.key) {
        case "Tab":
            modal.focus();
            break;
    }
});

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

/* in the end: make sure all `a` tags are selectable, tabbable */
document.querySelectorAll("a").forEach(elem => {
    elem.setAttribute("tabindex", 0);
    elem.style.cursor = "pointer";
    elem.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            elem.onclick(e);
        }
    });
});