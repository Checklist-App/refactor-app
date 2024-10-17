import { useCrashlytics } from '@/src/store/crashlytics-report'
import { MMKV } from 'react-native-mmkv'
import DataBaseRepository from './DataBaseRepository'

const crashlitycsOperations = useCrashlytics.getState()
const mmkv = new MMKV()
const db = new DataBaseRepository(mmkv, crashlitycsOperations)

export default db
