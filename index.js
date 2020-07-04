const openGalleryButton = document.getElementById("open-gallery-button");
const modal = document.getElementById("modal");
const modalImageContainer = document.getElementById("modal-image-container");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const modalLeft = document.getElementById("modal-left");
const modalRight = document.getElementById("modal-right");
const imageList = document.getElementById("imageList");
const modalExit = document.getElementById("modal-exit");
let currentImage = 0;
let modalOpen = false;
let prevActiveElem = undefined;

images.forEach((img, i) => {
    if (img.url === undefined) {
        return;
    }
    const aElem = document.createElement("a");
    aElem.href = "#";
    aElem.classList.add("a-image-list");

    const imgElem = document.createElement("img");
    imgElem.src = imagePath + img.url;
    imgElem.classList.add("image-list");

    if (img.caption) {
        const captionElem = document.createElement("p");
        let caption = img.caption;
        if (caption.length > 68) {
            caption = caption.substring(0, 68) + "...";
        }
        captionElem.textContent = caption;
        captionElem.classList.add("image-list-caption");
        aElem.appendChild(captionElem);
    }

    aElem.onclick = e => open(e, i);
    aElem.appendChild(imgElem);
    imageList.appendChild(aElem);
})

changeModalImage(0);

openGalleryButton.onclick = open;
modal.onclick = exit;

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
    modalImage.src = imagePath + images[currentImage].url;
    modalCaption.textContent = images[currentImage].caption;
}

function exit(e) {
    modal.style.display = "none";
    modalOpen = false;
    if (document.body.contains(prevActiveElem)) {
        prevActiveElem.focus();
    }
}

modalImage.onclick = function(e) {
    e.stopPropagation();
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