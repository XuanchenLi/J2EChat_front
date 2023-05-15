// 封装操作localstorage本地存储的方法  模块化

export const storage = {
    set(key:string, value:any) {
        localStorage.setItem(key, JSON.stringify(value));
        // localStorage.key = value;
        // localStorage[key] = value;
    },
    get(key:string) {
        // console.log(localStorage.getItem(key));
        if (localStorage.getItem(key) !== "undefined") {
            return JSON.parse(localStorage.getItem(key) as string);
        }else
            return "";
    },
    getForIndex(index:any) {
        return localStorage.key(index);
    },
    getKeys(){
        let items = this.getAll();
        let keys = [];
        for (let index=0;index<items.length;index++){
            keys.push(items[index].key);
        }
        return keys;
    },
    getLength() {
        return localStorage.length;
    },
    getSupport() {
        return (typeof (Storage) !== "undefined") ? true : false;
    },
    remove(key:string) {
        localStorage.removeItem(key);
    },
    removeAll() {
        localStorage.clear();
    },
    getAll() {
        let len = localStorage.length;  // 获取长度
        let arr = new Array(); // 定义数据集
        for (var i = 0; i < len; i++) {
            // 获取key 索引从0开始
            var getKey = localStorage.key(i);
            // 获取key对应的值
            var getVal = localStorage.getItem(getKey as string);
            // 放进数组
            arr[i] = {
                'key': getKey,
                'val': getVal,
            }
        }
        return arr;
    }
}

/**
 * 封装操作sessionStorage本地存储的方法
 */
export const sessionStorage = {
    //存储
    set(key: string, value: any) {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },
    //取出数据
    get<T>(key: string) {
        const value = window.sessionStorage.getItem(key)
        if (value && value != "undefined" && value != "null") {
            return JSON.parse(value)
        }
        return null
    },
    // 删除数据
    remove(key: string) {
        window.sessionStorage.removeItem(key)
    }
}

export default storage;
