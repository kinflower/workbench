// 判断对象中每个值是否都为空
export function objIsNotNull(obj: Object) {
    return Boolean(Object.values(obj).filter(item => !item).length)
}
// 判断对象中每个值是否都为空，返回值为空的键名
export function objIsNullName(obj: any) {
    return Object.keys(obj).filter(key => {
        if (!obj[key]) {
            return key
        }
    })
}
// 生成一个六位随机数
export function generateRandomNumber(num: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// 邮箱验证
export function validateEmail(email: string) {
    const re: any = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
// 颜色格式化
export function rgbToHex(r: number, g: number, b: number) {
    const rHex: string = (r < 16 ? '0' : '') + Math.max(0, Math.min(255, Math.round(r))).toString(16);
    const gHex: string = (g < 16 ? '0' : '') + Math.max(0, Math.min(255, Math.round(g))).toString(16);
    const bHex: string = (b < 16 ? '0' : '') + Math.max(0, Math.min(255, Math.round(b))).toString(16);
    return `#${rHex}${gHex}${bHex}`;
}
export function rgbStringToHex(rgbString: string) {
    const [, red, green, blue]: any = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return rgbToHex(parseInt(red), parseInt(green), parseInt(blue));
}