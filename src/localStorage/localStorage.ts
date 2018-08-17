import * as localForage from  "localforage";
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { localStoragePrototypeDefintion } from './localStorage.model'; 

export class XLocalStorage {

    cache:any = {}; 
    driver:any; 
    store:any = false; 
    defines:localStoragePrototypeDefintion[] = [
        { name: 'setItem', value:this.setItem }, 
        { name: 'getItem', value:this.getItem }, 
        { name: 'removeItem', value:this.removeItem }, 
        { name: 'key', value:this.key }, 
        { name: 'clear', value:this.clear }, 
        { name: 'override', value: this.override }  
    ];
    config:any =  {
        name: 'x-localStorage',
        storeName: 'x-localStorage',
        driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    } 

    constructor() {}

    public async init() { 

        if(this.store) return; 

        console.info("x-localStorage starting..."); 

        try { 

            if(!!(<any>window).cordova) {
              localForage.defineDriver(CordovaSQLiteDriver);
            } else { 
              this.config.driverOrder.splice(0, 1); 
            }
            console.info("x-localStorage loading with config : ", this.config); 
            this.store = localForage.createInstance(this.config);

            await this.store.ready(); 
            this.driver = this.store.driver();

            await this.store.iterate( (value:any, key:string, index:number) => {    
                console.info("x-localStorage loading in memory : ", key, "=>", value); 
                storage.cache[key] = value; 
            })
                
            this.defines.forEach( define => { 
                (<any>Storage).prototype[define.name] = define.value; 
            });

            console.info("x-localStorage ready with driver : ", this.driver); 

        } catch (error) { 
            throw new Error("x-localStorage.init() : "+error.stack); 
        }

        return this;  
    }

    /**
     * Sets a value to localStorage by key
     *
     * @param {string} key
     * @param {any} value
     * @returns {Promise<any>}
     */
    public async setItem(key:string, value:any) { 
        try { 
            let encodedKey = btoa(key); 
            if(JSON.stringify(storage.cache[encodedKey]) == JSON.stringify(value)) return;
            storage.cache[encodedKey] = value; 
            return await storage.store.setItem(encodedKey, value)
        } catch (error) { 
            delete storage.cache[key];  
            throw new Error("x-localStorage.setItem() : "+error.stack); 
        }
    }

    /**
     * Gets value from localStorage by key
     *
     * @param {string} key
     * @returns {<any>}
     */
    public getItem(key:string) { 
        let encodedKey = btoa(key); 
        return storage.cache[encodedKey] || null;    
    }

    /**
     * Removes value in localStorage by key
     *
     * @param {string} key
     */
    public async removeItem(key:string) { 
        let encodedKey = btoa(key); 
        if(encodedKey && storage.cache[encodedKey]) { 
         try { 
         await storage.store.removeItem(encodedKey);
         delete storage.cache[encodedKey]; 
         return; 
         } catch (error) { 
            throw new Error("x-localStorage.removeItem() : "+error.stack);  
         }
        }
    }

    /**
     * Returns a key name by index
     *
     * @param {number} index
     * @returns {string || null}
     */
    public key(index:number) { 
        let key = Object.keys(storage.cache)[index]; 
        return key ? atob(key) : null; 
    }

    /**
     * Returns the total length of stored values
     *
     * @returns {number || null}
     */
    public length() { 
        return Object.keys(storage.cache).length || null; 
    }

    /**
     * Clears all stored values
     */
    public async clear() {
        try {
          await storage.store.clear();
          storage.cache = {}; 
          return;  
        } catch (error) { 
            throw new Error("x-localStorage.clear() : "+error.stack);  
        }     
    }

    /**
     * Implicitly indicates if window.localstorage was overwritten (redefined by this class)
     */
    public override() { 
       return true; 
    }

}


export let storage = new XLocalStorage();