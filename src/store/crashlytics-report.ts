import { firebase, FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics"
import { create } from "zustand"

export interface CrashlyticsReportProps {
    crashlyticsInstance: FirebaseCrashlyticsTypes.Module | undefined
    initCrashlyticsReport: () => Promise<void>
    sendLog: (message: string) => void
    sendStacktrace: (fn: Function) => void
    sendPathname: (pathname: string) => void
    reportError: (error: Error) => void
    crashApp: () => void
    setUserId: (userId: string) => Promise<void>
}

export const useCrashlytics = create<CrashlyticsReportProps>((set, get) => {
    return {
        crashlyticsInstance: undefined,
        
        async initCrashlyticsReport() {
            get().sendStacktrace(get().initCrashlyticsReport)
            let crashlyticsInitial: FirebaseCrashlyticsTypes.Module | undefined = undefined
            if(firebase.apps.length === 0){
                console.log("Não existe instancia Firebase.");
                
                const firebaseConfig = {
                    apiKey: 'AIzaSyA5BOCY_1-tjzj-GnLFoam2ypnRy8Elz8E',
                    authDomain: 'smartlist-2fb7f.firebase.com',
                    projectId: 'smartlist-2fb7f',
                    storageBucket: 'smartlist-2fb7f.appspot.com',
                    messagingSenderId: '657988783284',
                    appId: '1:657988783284:android:96201869ce2a3cccae1be1'
                }
    
                crashlyticsInitial = (await firebase.initializeApp(firebaseConfig)).crashlytics()
            }else{
                crashlyticsInitial = firebase.crashlytics();
            }

            console.log("crashlyticsInitial =>", crashlyticsInitial)

            await crashlyticsInitial?.setCrashlyticsCollectionEnabled(true)

            set({
                crashlyticsInstance: crashlyticsInitial
            })
        },

        sendLog(message) {
            const { crashlyticsInstance } = get()
            if(!crashlyticsInstance) return

            crashlyticsInstance.log(message)
        },

        sendStacktrace(fn) {
            const { crashlyticsInstance, sendLog } = get()
            if(!crashlyticsInstance) return
            
            sendLog(`Entrou na função: ${fn.name}`)
        },

        sendPathname(pathname) {
            const { crashlyticsInstance, sendLog } = get()
            if(!crashlyticsInstance) return

            sendLog(`Pathname: ${pathname}`)
        },

        reportError(error) {
            const { crashlyticsInstance } = get()
            if(!crashlyticsInstance) return
            
            crashlyticsInstance.recordError(error)
        },

        crashApp() {
            const { crashlyticsInstance } = get()
            if(!crashlyticsInstance) return
            crashlyticsInstance.crash()
            console.log("crashlyticsInstance.crash() =>", crashlyticsInstance.crash());
            console.log("App is crashing...");
        },

        async setUserId(userId) {
            const { crashlyticsInstance } = get()   
            if(!crashlyticsInstance) return
            
            await crashlyticsInstance.setUserId(userId)
        },
    }
})