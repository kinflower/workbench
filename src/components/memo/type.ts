export interface Form {
    id?: string,
    title: string,
    content: string
}
export interface State {
    bold: boolean,
    italic: boolean,
    underline: boolean,
    [key: string]: boolean
}

export function drag() {
    const draggable: any = document.getElementById('memo');
    let active = false;
    let currentX: any;
    let currentY: any;
    let initialX: any;
    let initialY: any;
    let xOffset = 0;
    let yOffset = 0;
    draggable.onmousedown = (e: any) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === draggable) {
            active = true;
        }
    }
    document.onmousemove = (e: any) => {
        if (active) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            draggable.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)"
        }
    }
    document.onmouseup = () => {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }
    document.onmouseleave = () => {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }
}
export function resetDrag() {
    document.onmousemove = () => {}
    document.onmouseup = () => {}
    document.onmouseleave = () => {}
}