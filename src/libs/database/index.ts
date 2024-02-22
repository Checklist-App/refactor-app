import { MMKV } from 'react-native-mmkv'
import DataBaseRepository from './DataBaseRepository'

const mmkv = new MMKV()
const db = new DataBaseRepository(mmkv)

export default db
