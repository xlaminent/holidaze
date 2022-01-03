export const characterCounter = (event) => {
    const input = event.currentTarget;
    const maxCharacters = input.getAttribute("maxLength");
    const numberOfCharacters = input.value.length;

    document.querySelector(".form__counter__remaining").innerHTML = (maxCharacters - numberOfCharacters) + "/";
};

