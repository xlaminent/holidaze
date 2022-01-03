function generateLongId(){
    let date = new Date().getTime();
    const uuId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(constant) {
        const numbers = (date + Math.random()*16)%16 | 0;
        date = Math.floor(date/16);
        // eslint-disable-next-line
        return (constant==='x' ? numbers :(numbers&0x3|0x8)).toString(16);
    });

    return uuId;
}

export default generateLongId;